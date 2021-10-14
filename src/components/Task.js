import {Form, Select, Input, Radio, Space, Button} from "antd"
import { useHistory } from "react-router";
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

const Task = () => {

    const [form] = Form.useForm();
    const history = useHistory()
    const onFinish = (values) => {}

    return (
        <div>
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
            onFinish={onFinish}
            initialValues={{
                // residence: ['zhejiang', 'hangzhou', 'xihu'],
                // prefix: '86',
            }}
            scrollToFirstError
            >
                <Form.Item label="Task Status">
                    <Radio.Group>
                        <Radio value="incomplete">Incomplete</Radio>
                        <Radio value="complete">Complete</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label = "Progress Update">
                    <Input/>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Space>
                        <Button type="secondary" onClick = { () => history.goBack()}>Back</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
export default Task;