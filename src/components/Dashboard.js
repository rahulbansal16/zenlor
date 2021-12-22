import { Table, Select, Button, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { functions } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataAction } from "../redux/actions";
import Loader from "./Loader";
import { useHistory } from "react-router";
const { Option } = Select;
const actions = [
    {
        key: "Order Materials",
        value: "order_materials"
    },
    {
        key: "Create PO",
        value: "create_po"
    }
]

const columns = [
  {
    title: "Buyer",
    dataIndex: "buyer",
    key: "buyer",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Style Code",
    dataIndex: "styleCode",
    key: "styleCode",
  },
  {
    title: "Order Number",
    dataIndex: "orderNo",
    key: "orderNo",
  },
  {
    title: "Order Conf",
    dataIndex: "orderConfirmation",
    key: "orderConfirmation",
  },
  {
    title: "Order Quantity",
    dataIndex: "orderQuantity",
    key: "orderQuantity",
  },
  {
    title: "To Make Quantity",
    dataIndex: "toMakeQuantity",
    key: "toMakeQty",
  },
  {
    title: "Delivery Date",
    dataIndex: "deliveryDate",
    key: "deliveryDate",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Last Action",
    dataIndex: "lastAction",
    key: "lastAction",
  },
];

const formItemLayout = {};

const Dashboard = () => {

  const [selectedRows, setSelectedRows] = useState([]);
  const isFetching = useSelector((state) => state.taskReducer.isFetching);
  const history = useHistory();
  const styleCodesInfo = useSelector(
    (state) => state.taskReducer.styleCodesInfo
  );

  const dispatch = useDispatch();
  const fetchData = async () => {
    let getData = functions.httpsCallable("getData");
    const result = await getData();
    console.log("The result is ", result);
    dispatch(fetchDataAction({ ...result.data, isFetching: false }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isFetching) return <Loader />;

  return (
    <div>
      <Table
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows((state)=>state.concat(selectedRowKeys))
            console.log("Logging something"+`${selectedRowKeys} + ${selectedRows}`);
          },
        }}
        columns={columns}
        dataSource={
          styleCodesInfo
          .map((item) => ({
            ...item,
            key: item.id,
          }))
        }
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
        onFinish={(data) => {
          console.log(data, selectedRows);
          history.push({
            pathname: `/action/${data.action}`,
            search: `ids=${[...new Set(selectedRows)]}`
            
            // `styleCode=${styleCode || 123}&process=${process}&lineNumber=${
            //   lineNumber || 1
            // }&day=${day}`,
          });
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
              {actions.map( action => <Option size="large" value={action.value}>{action.key}</Option>)}
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

export default Dashboard;
