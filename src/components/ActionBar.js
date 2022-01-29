import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Select, Button, Form, Space } from "antd";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
const { Option } = Select;

const formItemLayout = {
    // labelCol: {
    //     xs: {
    //       span: 20,
    //     },
    //     sm: {
    //       span: 20,
    //     },
    //     md : {
    //       span: 18,
    //       offset:4
    //     },
    //     lg : {
    //         span: 4,
    //         offset: 0
    //     },
    //     xl: {
    //         span: 32,
    //         offset: 0
    //     },
    //     xxl: {
    //         span: 4,
    //         offset: 0
    //     }

    //   },
    //   wrapperCol: {
    //     xs: {
    //       span: 20,
    //       // offset:2
    //     },
    //     sm: {
    //       span: 20,
    //       // offset:2
    //     },
    //     xl: {
    //         span: 0,
    //     },
    //     xxl: {
    //         span: 24,
    //     }
    //   },
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
  ],
  purchaseOrder:[
    {
      key: "View Line Items",
      value: "viewLineItems"
    },
    {
      key: "Inward Material",
      value: "inwardMaterial"
    }
  ],
  inwardMaterial: [{
    key: "Inward Item",
    value:"inwardItem"
  }]
};

const ActionBar = ({type, onFinish}) => {
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect( () => {
      form.resetFields()
    } , [type])

    return (
        <Form
        layout="inline"
        form = {form}
        {...formItemLayout}
        style = {{
          marginBottom:'40px'
        }}
        size="medium"
        onFinish={async (data) => {
          await onFinish(data);
        }}
      >
        <Form.Item
          label=""
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
              <Option size="large" value={action.value} key = {action.key}>
                {action.key}
              </Option>
            ))}
          </Select>
        </Form.Item>
          <Space>
            <Button onClick = { () => {
              history.goBack()
            }}><LeftOutlined/> Back</Button>
            <Button type="primary" htmlType="submit">
              Next <RightOutlined />
            </Button>
          </Space>
      </Form>   
    )
}

export default ActionBar;