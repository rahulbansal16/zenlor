import { Table, Select, Button, Form, Input, Space, Affix } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
// https://codesandbox.io/s/editable-cells-antd-4-17-4-forked-w3q20?file=/index.js:1809-1869
import Loader from "./Loader";
import { useLocation } from "react-router";
import React,{ useEffect, useContext, useState, useRef } from "react";
import { functions } from "../firebase";
import { generateUId, getCurrentTime } from "../util";
import { fetchPOs, insertRow, updateCell } from "../redux/actions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ActionBar from "./ActionBar";
import useFilter from "../hooks/useFilter";
const header = {
  orderMaterials: "BOM",
  createPO: "Purchase Orders",
  dashboard: "Dashboard"
}
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


const Action = ({ type }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const action = useSelector((state) => state.taskReducer[type]);
  const isFetching = useSelector((state) => state.taskReducer.isFetching);
  const { search } = useLocation();
  const { columns, dataSource } = action;
  const filteredColumns = useFilter(columns);

  if (isFetching) {
    return <Loader />;
  }

  const applyFilter = (dataSource) => {
    const styleCode = new URLSearchParams(search).get('styleCode')??',';
    const styleCodes = styleCode.split(',')
    console.log("The length of styleCodes is", styleCodes)
    if (type === "orderMaterials") {
      if (styleCodes[0] !== "")
        return dataSource.filter((item) => styleCodes.includes(item.styleCode) || !item.styleCode);
    }
    return dataSource;
  };

  const onFinish = async (data) => {
    const action = data.action;
    console.log("The data is", data);
    if (action === "createPO") {
      let createPO = functions.httpsCallable("createPO");
      const result = await createPO({
        bom: dataSource.filter(item => selectedRows.includes(item.id)),
        createdAt: getCurrentTime(),
      });
      console.log("The result is", result.data);
      dispatch(fetchPOs(result.data))
      history.push('/action/'+action)
    } else if (action === "orderMaterials"){
      console.log(data, selectedRows);
      history.push({
        pathname: `/action/${data.action}`,
        search: `styleCode=${[...new Set(selectedRows)]}`
      })
    } else if (action === "downloadPO"){
      console.log("In the action of downloadPO");
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };

  const column = filteredColumns.map((col) => {
    // if (!col.editable) {
    //   return col;
    // }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable || true,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave:async (e) => {
          console.log("The e in update cell is", e)
          dispatch(updateCell(e, type))
          const updateStyleCodesInfo = functions.httpsCallable("actions")
         await updateStyleCodesInfo({
            item: e,
            type
          })
        }
      })
    };
  });

  const insertRowHandler = () => {
    console.log("In the insert Row Handler")
    dispatch(insertRow({
      id: generateUId("", 8),
    },type))
  }
  
  console.log("The type is", type);
  return (
    <div>
      <Table
        title={() => header[type].toUpperCase()}
        style={{
          maxHeight:'calc(100vh - 50px)'
        }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
            <Table.Summary.Cell><Button type="primary" size="large" onClick={() => insertRowHandler()}>Add Entry<PlusOutlined/></Button>            
            </Table.Summary.Cell>
            {/* <Table.Summary.Cell>
                         <div style={{display:'flex'}}>
                          <Button>Plus</Button>
                          <Button>Delete</Button>
                      </div>
            </Table.Summary.Cell> */}
              {/* <div className="fx-sp-bt wd-100"> */}
                
                {/* <div style={{display:'flex'}}> */}
                  {/* <Button>Plus</Button>
                  <Button>Delete</Button>
                </div> */}
              {/* </div> */}
            </Table.Summary.Row>
          </Table.Summary>
        )}
        bordered
        pagination={false}
        size="small"
        sticky={true}
        components={components}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            let selectedStyleCode = selectedRows.map ( row => row.styleCode)
            setSelectedRows(selectedStyleCode);
          },
        }}
        columns={column}
        dataSource={applyFilter(dataSource).map((item) => ({
          ...item,
          key: item.id,
        }))}
      />
      <ActionBar type={type} onFinish={onFinish}/>
    </div>
  );
};
export default Action;
