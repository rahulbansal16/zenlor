import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Select, Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
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
      key: "Cancel PO",
      value: "cancelPO"
    },
    {
      key: "DO GRN",
      value: "grns"
    },
    {
      key:"OPEN GRN",
      value: "openGRN"
    }
  ],
  inwardMaterial: [{
    key: "Inward Item",
    value:"inwardItem"
  }],
  grns: [{
    key: "Inward Material",
    value:"inwardMaterial"
  }]
};

const ActionBar = ({type, onFinish, loading}) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [disabledSave, setDisabledSave] = useState(true);


    useEffect( () => {
      form.resetFields()
      setDisabledSave(true)
    } , [type])

    return (
        <Form
        layout="inline"
        form = {form}
        {...formItemLayout}
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
            style={{ border:"green 3px solid"}}
            autoFocus
            onChange={() => {setDisabledSave(false)}}
            // allowClear
            // getPopupContainer={() => document.getElementById("table")}
            // dropdownStyle={{marginBottom:'30px'}}
          >
            {(actions[type]??[]).map((action) => (
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
            <Button type="primary" htmlType="submit" loading={loading} disabled={disabledSave}>
              Next <RightOutlined />
            </Button>
          </Space>
      </Form>   
    )
}

export default ActionBar;