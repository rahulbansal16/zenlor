// Add a form to allow to add the task name and due date in the task editor.

import {
    Form,
    Input,
    Radio,
    Space,
    Button,
    Image,
    Typography,
    DatePicker,
    Timeline,
  } from "antd";

import { useHistory } from "react-router";
import CONSTANTS from "../CONSTANTS";
import { createTask } from "../firebase";

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

  const TaskEditor = ({styleCodeId}) => {
    const [form] = Form.useForm();
    const history = useHistory();

    const onFinish = async (values) => {
        console.log(values)
        values['companyId'] = CONSTANTS.companyId
        values['styleCodeId'] = styleCodeId
        values['status'] = 'incomplete'
        createTask(values);
        history.push('/stylecodes')
    };

    return (<div>
        <h1>Add Task</h1>
        <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        style={{
          marginLeft: "8px",
          marginRight: "8px",
        }}
        size="large"
        name="styleCodeEditor"
        align="left"
        onFinish={onFinish}
        initialValues={{
          name: "",
          dueDate:""
        }}
        scrollToFirstError
      >
        <Form.Item
          label="1. Task Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please Enter the Task Name",
            },
          ]}
        >
            <Input/>
        </Form.Item>
        <Form.Item
          label="2. Due Date"
          name="dueDate"
          rules={[
            {
              required: true,
              message: "Please add the DueDate",
            },
          ]}
        >
          <DatePicker type="button"/>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button danger onClick={() => history.goBack()}>
              Back
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>)
}

export default TaskEditor;