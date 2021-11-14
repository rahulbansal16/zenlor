import {Form, InputNumber, Button, Space} from "antd"
import { useHistory  } from "react-router";
import { formItemLayout, tailFormItemLayout } from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    sending: [{
        label: "Enter Washing Sent Quantity",
        name: "washingSentQuantity"
    }],
    receiving:[{
        label: "Enter Washing Received Quantity",
        name: "washingReceivedQuantity"
    }],
}
const WashingForm = ({initialValues, process, onFinish}) => {
    const [form] = Form.useForm();
    const history = useHistory()
    return (
        <div>
            <Form
                {...formItemLayout}
                style = {{
                    marginLeft:'8px',
                    marginRight:'8px'
                }}
                size="large"
                name="styleCodeEditor"
                align="left"
                labelAlign="left"
                onFinish={(data) => {
                    console.log(data);
                    onFinish(data)
                }}
            >
                  {dataInput[process].map (
                    ({label, name}) => <Form.Item label={label} name = {name} key={name} rules={[{
                        required: true,
                        message: "Please Enter a value"
                    }]}><InputNumber inputMode="numeric"/></Form.Item>)}                <Form.Item {...tailFormItemLayout}>
                    <Space>
                        <Button onClick = {() => history.goBack()}>Back</Button>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default WashingForm