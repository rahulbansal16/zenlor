import { Table, Select, Button, Form } from "antd";
import { useSelector } from "react-redux";
import { RightOutlined } from "@ant-design/icons";

import Loader from "./Loader";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { functions } from "../firebase";
import { getCurrentTime } from "../util";
const { Option } = Select;
const actions = {
  order_materials: [
    {
      key: "Create PO",
      value: "create_po",
    },
  ],
};

const next_action = {
  order_materials: "create_po",
};
const formItemLayout = {};

const Action = ({ type }) => {
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

  const filterSelectedRows = () => {
      return dataSource.filter(item => selectedRows.includes(item.id))
  };

  const onFinish = async (data) => {
    const action = data.action;
    console.log("The data is", data);
    if (action === "create_po") {
      let createPO = functions.httpsCallable("createPO");

      await createPO({
        bom: dataSource.filter(item => selectedRows.includes(item.id)),
        createdAt: getCurrentTime(),
      });
    } else {
    }
  };

  console.log("The type is", type);
  return (
    <div>
      <Table
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows((state) => state.concat(selectedRowKeys));
            console.log(
              "Logging something" + `${selectedRowKeys} + ${selectedRows}`
            );
          },
        }}
        columns={columns}
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
