import { Table, Select, Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RightOutlined } from "@ant-design/icons";
// https://codesandbox.io/s/editable-cells-antd-4-17-4-forked-w3q20?file=/index.js:1809-1869
import Loader from "./Loader";
import { useLocation } from "react-router";
import React,{ useEffect, useContext, useState, useRef } from "react";
import { functions } from "../firebase";
import { getCurrentTime } from "../util";
import { fetchPOs, updateCell } from "../redux/actions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const { Option } = Select;
const actions = {
  order_materials: [
    {
      key: "Create PO",
      value: "create_po",
    },
  ],
  create_po: [
    {
      key: "Download PO",
      value: "download_po"
    }
  ]
};

const next_action = {
  order_materials: "create_po",
};
const formItemLayout = {};
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

  if (isFetching) {
    return <Loader />;
  }

  const { columns, dataSource } = action;

  const applyFilter = (dataSource) => {
    if (type === "order_materials") {
      const ids = new URLSearchParams(search).get("ids").split(",");
      console.log("The ids are ", ids);
      return dataSource.filter((item) => ids.includes(item.styleCode));
    }
    return dataSource;
  };

  const onFinish = async (data) => {
    const action = data.action;
    console.log("The data is", data);
    if (action === "create_po") {
      let createPO = functions.httpsCallable("createPO");
      const result = await createPO({
        bom: dataSource.filter(item => selectedRows.includes(item.id)),
        createdAt: getCurrentTime(),
      });
      console.log("The result is", result.data);
      dispatch(fetchPOs(result.data))
      history.push('/action/'+action)
    } else {

    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };

  const column = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    console.log("The Cell is Editable", col)
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (e) => {
          console.log("Cell saved called",e)
          dispatch(updateCell(e, type))
        }
      })
    };
  });

  console.log("The type is", type);
  return (
    <div>
      <Table
        rowClassName={() => "editable-row"}
        bordered
        components={components}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows((state) => state.concat(selectedRowKeys));
            console.log(
              "Logging something" + `${selectedRowKeys} + ${selectedRows}`
            );
          },
        }}
        columns={column}
        dataSource={applyFilter(dataSource).map((item) => ({
          ...item,
          key: item.id,
        }))}
      />
      <Form
        {...formItemLayout}
        style={{
          marginLeft: "8px",
          marginRight: "8px",
        }}
        size="medium"
        name="styleCodeEditor"
        align="left"
        labelAlign="left"
        onFinish={async (data) => {
          await onFinish(data);
          //   console.log(data, selectedRows);
          //   history.push({
          //     pathname: `/action/${data.action}`,
          //     search: `ids=${[...new Set(selectedRows)]}`
          //     // `styleCode=${styleCode || 123}&process=${process}&lineNumber=${
          //     //   lineNumber || 1
          //     // }&day=${day}`,
          //   });
        }}
      >
        <Form.Item
          label="Choose an Action"
          name="action"
          rules={[
            {
              required: true,
              message: "Please Choose Action",
            },
          ]}
        >
          <Select
            placeholder="Select Action"
            size="medium"
            autoFocus
            onChange={() => {}}
            allowClear
          >
            {actions[type].map((action) => (
              <Option size="large" value={action.value}>
                {action.key}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <div className="wd-100">
          <Button type="primary" htmlType="submit">
            Next <RightOutlined />
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default Action;
