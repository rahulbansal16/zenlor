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
import { createStyleCode } from '../firebase';
import { Avatar, Typography } from 'antd';
import CONSTANTS from '../CONSTANTS';
import {getTimeStamp} from "../util";
import { useHistory } from 'react-router-dom';
import MessageBox from './Messagebox';


const { Option } = Select;
const { Title } = Typography;
const residences = [
  {},{}
];
const formItemLayout = {
  labelCol: {
    xs: {
      span: 20,
      // offset:2
    },
    sm: {
      span: 20,
    },
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
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      // offset: 2,
    },
    sm: {
      span: 24,
      // offset: 2,
    },
  },
};

const RegistrationForm = ({messageBoxStateHandler}) => {

  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = (values) => {
    values['sizeSet'] = generateSizeSet()
    values['companyId'] = CONSTANTS.company_id
    if (!values['dueDate'])
      values['dueDate'] = getTimeStamp() + CONSTANTS.days_75;
    // {title, text, backHandler, forwardHandler, open}
    messageBoxStateHandler({
      open: true,
      okButtonText:'Yes',
      cancelButtonText:'Cancel',
      text:'Style Codes details cannot be changed later. PROCCED?',
      forwardHandler: () => {
        createStyleCode(values)
        history.push('/home')
      },
      backHandler: () => messageBoxStateHandler({open:false})
    })
    // console.log('The value of the sizeSet is', generateSizeSet())
    console.log('Received values of form: ', values);
  };

  const generateSizeSet = () => {
    const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl']
    var set = {}
    for (let i of sizes){
      set[i] = document.getElementById(i).value
    }
    return set
  }

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
      style = {{
        marginLeft:'8px',
        marginRight:'8px'
      }}
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
        name="garmentCategory"
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
      <Form.Item name = "quantitySet" label="Enter Quantity XS | S | M | L | XL | XXL ">
        <Space wrap>
            <InputNumber id = "xs" inputMode="numeric" placeholder="XS"/>
            <InputNumber id = "s" inputMode="numeric" placeholder="S"/>
            <InputNumber id = "m" inputMode="numeric" placeholder="M"/>
            <InputNumber id = "l" inputMode="numeric" placeholder="L"/>
            <InputNumber id = "xl" inputMode="numeric" placeholder="XL"/>
            <InputNumber id = "xxl" inputMode="numeric" placeholder="XXL"/>
        </Space>
      </Form.Item>

      <Form.Item
        name="styleCode"
        label="Enter Style Code"
      >
          <Input/>
      </Form.Item>
       <Form.Item {...tailFormItemLayout}>
        <Space>
            <Button type="secondary" onClick = { () => {
                messageBoxStateHandler({
                  open: true,
                  okButtonText:'Yes',
                  cancelButtonText:'Cancel',
                  text:'Style Codes Not saved. Exit?',
                  forwardHandler: () => {
                    // createStyleCode(values)
                    messageBoxStateHandler({open:false})
                    history.push('/home')
                    // history.push('/home')
                  },
                  backHandler: () => messageBoxStateHandler({open:false})
    })
            }}> Back </Button>
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
  // {title, text, backHandler, forwardHandler, open}
  const [messageBoxState, setMessageBoxState] = useState({
    open: false,
    okButtonText: '',
    cancelButtonText: '',
    text:'',
    backHandler: () => {},
    forwardHandler:() => {}
  })

    return (
        <div
        // style = {{marginLeft:'auto', marginRight:'auto'}}
        >
            <Title align="left" level={2} style ={{
              marginLeft:'8px'
            }}>Create StyleCode</Title>
            <RegistrationForm messageBoxStateHandler = {setMessageBoxState}/>
            <MessageBox {...messageBoxState}/>
        </div>
    );
  }
export default StyleCodeEditor;