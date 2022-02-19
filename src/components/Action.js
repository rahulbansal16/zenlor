import {
  Table,
  Select,
  Button,
  Form,
  Input,
  Space,
  Affix,
  Tooltip,
  DatePicker,
  notification,
  Result,
} from "antd";
import { Table as ExportTable } from "ant-table-extensions";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, PlusOutlined, RightOutlined, SmileOutlined } from "@ant-design/icons";
// https://codesandbox.io/s/editable-cells-antd-4-17-4-forked-w3q20?file=/index.js:1809-1869
import Loader from "./Loader";
import { useLocation } from "react-router";
import React, { useEffect, useContext, useState, useRef } from "react";
import { functions } from "../firebase";
import {
  downloadCsv,
  generateUId,
  getCurrentTime,
  performCalculation,
  purchaseMaterialKey,
} from "../util";
import {
  fetchDataAction,
  fetchPOs,
  fetchPurchaseMaterialsInfo,
  insertRow,
  updateCell,
  updateData,
} from "../redux/actions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ActionBar from "./ActionBar";
import useFilter from "../hooks/useFilter";
import { Typography } from "antd";
import { Row, Col, Divider } from 'antd';
import AddNewModal from "./AddModal";

const { Title } = Typography;

const header = {
  orderMaterials: "BOM",
  createPO: "Purchase Orders",
  dashboard: "Dashboard",
  purchaseOrder: "Purhcase Orders",
  inwardMaterial: "GRN",
};
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
  const isDate = dataIndex?.includes("Date");
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    let fieldValue = {
      [dataIndex]: record[dataIndex],
    };
    if (isDate) {
      fieldValue[dataIndex] = moment(record[dataIndex]);
    }
    form.setFieldsValue(fieldValue);
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      let formattedValue = values;
      if (isDate) {
        formattedValue[dataIndex] = moment(values[dataIndex]).format(
          "MMM DD YY"
        );
      }
      handleSave({ ...record, ...formattedValue });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    const loadFormWithDate = () => {
      return (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <DatePicker ref={inputRef} onBlur={save} format="MMM DD YY" />
        </Form.Item>
      );
    };

    const loadForm = () => {
      return (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      );
    };
    childNode = editing ? (
      isDate ? (
        loadFormWithDate()
      ) : (
        loadForm()
      )
    ) : (
      <Tooltip title={children}>
        <div className="editable-cell-value-wrap" onClick={toggleEdit}>
          {children}
        </div>
      </Tooltip>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const saveCellToServer = async (item, type, company) => {
  let methodName = "";
  let payload = { company}
  switch(type){
    case "dashboard": 
      methodName = "upsertStyleCodesInfo"
      payload = {
        ...payload,
        styleCodes: [item]
      }      
      break;
    case "createPO":
      methodName = "upsertPurchaseMaterialsInfo"
      payload = {
        ...payload,
        purchaseMaterials: [item]
      }
      break;
    case "orderMaterials":
      methodName = "upsertBOMInfo";
      payload = {
        ...payload,
        boms: [item]
      }
      break;
    case "inwardMaterial":
      methodName = "upsertGRNItem";
      payload = {
        ...payload,
        GRN: [item]
      }
      break;
    default:
      methodName = "";
  }
  const method = functions.httpsCallable(methodName)
  return await method(payload);
}

const Action = ({ type }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedRowKeys, setSelectedRowsKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [selectedRowsKeys, setSelectedRowsKeys] = useState([])
  const user = useSelector((state) => state.taskReducer.user);
  const action = useSelector((state) => state.taskReducer[type] || {columns:undefined,dataSource:undefined});
  const isFetching = useSelector((state) => state.taskReducer.isFetching);
  const { search } = useLocation();
  const [loading, setLoading] = useState(false);
  const { columns, dataSource } = action;
  const filteredColumns = useFilter(columns, dataSource);

  useEffect(() => {
    console.log("Calling for type", type);
    // setSelectedRowsKeys([])
    setSelectedRowsKeys([]);
  }, [type, action]);

  if (isFetching) {
    return <Loader />;
  }

  if (!columns)
    return    <Result
          icon={<SmileOutlined/>}
          title="We are working on it"
          subTitle="We are actively building the functionality. Stay Tuned."
      />
  const applyFilter = (dataSource) => {
    if (!dataSource)
     return dataSource

    if (type === "orderMaterials") {
      const styleCode = new URLSearchParams(search).get("styleCode") ?? ",";
      const styleCodes = styleCode.split(",");
      console.log("The length of styleCodes is", styleCodes);
      if (styleCodes[0] !== "")
        return dataSource.filter(
          (item) => styleCodes.includes(item.styleCode) || !item.styleCode
        );
    }
    if (type === "createPO") {
      const id = new URLSearchParams(search).get("id") ?? ",";
      const ids = id.split(",");
      if (ids[0] !== "")
        return dataSource.filter((item) =>
          ids.includes(purchaseMaterialKey(item))
        );
    }
    if (type === "purchaseOrder") {
      const id = new URLSearchParams(search).get("id") ?? ",";
      const ids = id.split(",");
      if (ids[0] !== "")
        return dataSource.filter(
          (item) => ids.includes(item.purchaseOrderId) || !item.purchaseOrderId
        );
    }
    if (type === "inwardMaterial") {
      const id = new URLSearchParams(search).get("poId") ?? ",";
      const ids = id.split(",");
      if (ids[0] !== "")
        return dataSource.filter(
          (item) => ids.includes(item.purchaseOrderId) || !item.purchaseOrderId
        );
    }
    return dataSource;
  };

  //
  const onFinish = async (data) => {
    const action = data.action;
    const { company } = user;
    if (selectedRows.length === 0){
      notification['warn']({
        message: "No Row Selected",
        description: "Please Select any row to continue"
      })
      return
    }
    console.log("The data is", data);
    if (action === "createPO") {
      // const selectedIds = selectedRows.map ( row => row.id)
      // let upsertPurchaseMaterialsInfo = functions.httpsCallable("upsertPurchaseMaterialsInfo");
      // const result = await upsertPurchaseMaterialsInfo({
      //   purchaseMaterials: dataSource.filter(item => selectedIds.includes(item.id)),
      //   company
      //   // createdAt: getCurrentTime(),
      // });
      // console.log("The result is", result.data);
      // dispatch(fetchPurchaseMaterialsInfo(result.data.purchaseMaterialsInfo))
      const selectedItems = selectedRows.map(purchaseMaterialKey);
      history.push({
        pathname: `/action/${action}`,
        search: `id=${selectedItems}`,
      });
      // '/action/'+action)
    } else if (action === "orderMaterials") {
      const selectedStyleCodes = selectedRows.map((row) => row.styleCode);
      history.push({
        pathname: `/action/${data.action}`,
        search: `styleCode=${selectedStyleCodes}`,
      });
    } else if (action === "downloadPO") {
      setLoading(true)
      console.log("In the action of downloadPO");
      const upsertCreatePO = functions.httpsCallable("upsertCreatePO");
      const selectedIds = selectedRows.map((row) => row.id)
      let result = ""
      try {
          result = await upsertCreatePO({
            company,
          createdAt: getCurrentTime(),
          purchaseMaterials: selectedRows,
        });
        notification["success"]({
          message: "PO Created Successfully",
          description: "PO is created successfully"
        }) 
        dispatch(fetchPurchaseMaterialsInfo(result.data.purchaseMaterialsInfo));
      } catch(e){
       notification["error"] ({
         message:"Error Creating PO",
         description: e.message
       })
      }
      // console.log("The result is", result);
   
      // result.data.purchaseOrdersInfo.forEach((element) => {
      //   downloadCsv(element);
      // });
      setLoading(false)
   
      // history.push({
      //   pathname: `/action/purchaseOrder`,
      //   search: `id=${selectedIds}`
      // })
    } else if (action === "inwardMaterial") {
      const poId = selectedRows.map((item) => item.id);
      history.push({
        pathname: `/action/${data.action}`,
        search: `poId=${poId}`,
      });
    } else if (action === "viewLineItems") {
    } else if (action === "inwardItem") {
      // This will do actualGRN as in updating the values in the db etc for the inventory
      const upsertGRN = functions.httpsCallable("upsertGRN");
      const result = await upsertGRN({
        company,
        createdAt: getCurrentTime(),
        GRN: selectedRows,
      });
      console.log("The result is ", result);
      dispatch(updateData(result.data));
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const column = filteredColumns.map((col) => {
    const { company } = user;
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      ellipsis: true,
      onCell: (record) => ({
        record,
        editable: col.editable || true,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: async (e) => {
          console.log("The e in update cell is", e);
          dispatch(updateCell(e, type, company));

          let newData = JSON.parse(JSON.stringify(dataSource));
          const index = newData.findIndex((item) => e.key === item.id);
          const item = newData[index];
          const newItem = performCalculation({...item, ...e},type)
          try {
            const result = await saveCellToServer(newItem, type, company)
            console.log("The result data is", result.data)
            dispatch(fetchDataAction({...result.data}))
          } catch(e){
            notification["error"]({
              message: "Error updating the cell",
              description: e.message
            })
          }
        },
      }),
    };
  });

  const insertRowHandler = () => {
    console.log("In the insert Row Handler");
    dispatch(
      insertRow(
        {
          id: generateUId("", 8),
        },
        type
      )
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowsKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  console.log("The type is", type);
  return (
    <div style = {{
      maxWidth:'98vw'
    }}>
      {/* <Button onClick={()=>{
        history.push('/action/purchaseOrder')        
      }}>GRN</Button> */}
      {loading?<Loader/>:<></>}
      <Row style = {{
        marginTop:'10px'
        }}>
              <Col span={22}>
                <Title level={4}>{header[type].toUpperCase()}</Title>
              </Col>
              <Col span={2}>
                <AddNewModal type={type} title={header[type]}/>
                {/* <Button type="primary">Add New</Button> */}
              </Col>
      </Row>
      <div style={{  overflowY: 'scroll', maxHeight:'88vh'}}>
      <ExportTable
        exportable
        // summary={() => (
        //   <Table.Summary fixed>
        //     <Table.Summary.Row>
        //       <Table.Summary.Cell>
        //         {/* <Button
        //           type="primary"
        //           size="middle"
        //           onClick={() => insertRowHandler()}
        //         >
        //           Add Entry
        //           <PlusOutlined />
        //         </Button> */}
        //       </Table.Summary.Cell>
        //       {/* <Table.Summary.Cell>
        //                  <div style={{display:'flex'}}>
        //                   <Button>Plus</Button>
        //                   <Button>Delete</Button>
        //               </div>
        //     </Table.Summary.Cell> */}
        //       {/* <div className="fx-sp-bt wd-100"> */}

        //       {/* <div style={{display:'flex'}}> */}
        //       {/* <Button>Plus</Button>
        //           <Button>Delete</Button>
        //         </div> */}
        //       {/* </div> */}
        //     </Table.Summary.Row>
        //     <Table.Summary.Row>
        //       <Table.Summary.Cell colSpan={12}>
        //         <ActionBar type={type} onFinish={onFinish} />
        //       </Table.Summary.Cell>
        //     </Table.Summary.Row>
        //   </Table.Summary>
        // )}
        bordered
        pagination={false}
        size="small"
        sticky={true}
        components={components}
        rowSelection={rowSelection}
        columns={column}
        dataSource={applyFilter(dataSource).map((item) => ({
          ...item,
          key: item.id,
        }))}
      />
      </div>

      <div style={{
        position: 'fixed',
        paddingTop:'20px',
        paddingLeft:'20px',
        bottom: '10px',
        // height:'90px',
        width: '100%'
      }}>
        <ActionBar type={type} onFinish={onFinish} />
      </div>
      {/* <ActionBar type={type} onFinish={onFinish}/> */}
    </div>
  );
};
export default Action;
