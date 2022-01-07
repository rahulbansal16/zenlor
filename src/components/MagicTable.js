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
  orderMaterials: [
    {
      key: "Create PO",
      value: "createPO",
    },
  ],
  createPO: [
    {
      key: "Download PO",
      value: "downloadPO"
    }
  ],
  dashboard: [
    {
        key: "Order Materials",
        value: "orderMaterials"
    },
    // {
    //     key: "Create PO",
    //     value: "createPO"
    // }
]
};

const header = {
  orderMaterials: "BOM",
  createPO: "Purchase Orders",
  dashboard: "Dashboard"
}
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


const MagicTable = ({ type, columns, dataSource, onFinishHandler, onCellSaveHandler }) => {

  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);

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
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (e) => {
          onCellSaveHandler(e)
        }
      })
    };
  });

  console.log("The type is", type);
  return (
    <div>
      {header()}
      <Table
        rowClassName={() => "editable-row"}
        bordered
        pagination={false}
        size="small"
        sticky={true}
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
        dataSource={dataSource.map((item) => ({
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
        onFinish={onFinishHandler}
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
export default MagicTable;
