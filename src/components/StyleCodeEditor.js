import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Dropdown,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Button,
  Space,
  AutoComplete,
} from 'antd';
const { Option } = Select;

const residences = [
  {},{}
];
const formItemLayout = {
  labelCol: {
    xs: {
      span: 20,
      offset:2
    },
    sm: {
      span: 20,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
      offset:2
    },
    sm: {
      span: 20,
      offset:2
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 2,
    },
    sm: {
      span: 24,
      offset: 2,
    },
  },
};

const RegistrationForm = () => {

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <Form
      {...formItemLayout}
      layout="vertical"
      form={form}
      size="large"
      name="styleCodeEditor"
      align="left"
    //   labelAlign="right"
      onFinish={onFinish}
      initialValues={{
        // residence: ['zhejiang', 'hangzhou', 'xihu'],
        // prefix: '86',
      }}
      scrollToFirstError
    >
      <Form.Item
        style = {{
            marginBottom:'20px',
            // backgroundColor:'pink',
            display:'flex'
        }}
        name="buyerName"
        label="Enter Buyer Name"
        rules={[{
            required: true,
            message: 'Please enter buyer name',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="dueDate"
        label="Enter Due Date"
        rules={[
        //   {
        //     required: true,
        //     message: 'Please input your password!',
        //   },
        ]}
        // hasFeedback
      >
          <DatePicker type="button"/>
      </Form.Item>

      <Form.Item
        name="garment Category"
        label="Enter Garment Category"
        rules={[
          {
            type: 'string',
            required: true,
            message: 'Please select Garment Category',
          },
        ]}
      >
        <Select placeholder="Select Garment Category">
          <Option value="casual">Casual</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

{/* XS S M L XL XXL */}
      <Form.Item name = "quantity" label="Enter Quantity XS | S | M | L | XL | XXL ">
        <Space wrap>
            <InputNumber inputMode="numeric" placeholder="XS"/>
            <InputNumber inputMode="numeric" placeholder="S"/>
            <InputNumber inputMode="numeric" placeholder="M"/>
            <InputNumber inputMode="numeric" placeholder="L"/>
            <InputNumber inputMode="numeric" placeholder="XL"/>
            <InputNumber inputMode="numeric" placeholder="XXL"/>
        </Space>
      </Form.Item>

      <Form.Item
        name="styleCode"
        label="Enter Style Code"
      >
          <Input/>

      </Form.Item>

      {/* <Form.Item
        name="website"
        label="Website"
        rules={[
          {
            required: true,
            message: 'Please input website!',
          },
        ]}
      >
        <AutoComplete options={websiteOptions} onChange={onWebsiteChange} placeholder="website">
          <Input />
        </AutoComplete>
      </Form.Item> */}

      {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[
                {
                  required: true,
                  message: 'Please input the captcha you got!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </Form.Item> */}

      <Form.Item {...tailFormItemLayout}>
        <Space>
            <Button type="secondary"> Back </Button>
            <Button type="primary" htmlType="submit">
            Register
            </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

// ReactDOM.render(<RegistrationForm />, mountNode);

const StyleCodeEditor = () => {

    return (
        <div
        // style = {{marginLeft:'auto', marginRight:'auto'}}
        >
            <h1>Create Style</h1>
            <RegistrationForm/>
        </div>
    );
  }
export default StyleCodeEditor;