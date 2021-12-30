import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Select, Button, Form, Space } from "antd";
import { useHistory } from "react-router-dom";
const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: {
          span: 20,
          // offset:2
        },
        sm: {
          span: 20,
        },
        m : {
          span: 18   
        }
      },
      wrapperCol: {
        xs: {
          span: 20,
          // offset:2
        },
        sm: {
          span: 20,
          // offset:2
        },
      },
}
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
  ]
};

const ActionBar = ({type, onFinish}) => {
    const history = useHistory();
    return (
        <Form
        {...formItemLayout}
        size="medium"
        name="styleCodeEditor"
        alig n="left"
        labelAlign="left"
        onFinish={async (data) => {
          await onFinish(data);
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
        <div>
          <Space>
            <Button onClick = { () => {
              history.goBack()
            }}><LeftOutlined/> Back</Button>
            <Button type="primary" htmlType="submit">
              Next <RightOutlined />
            </Button>
          </Space>
        </div>
      </Form>   
    )
}

export default ActionBar;