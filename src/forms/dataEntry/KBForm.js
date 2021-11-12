import {Form, InputNumber, Button, Space} from "antd"
import { useHistory  } from "react-router";
import { formItemLayout, tailFormItemLayout } from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    received_from_sewing: [{
        label: "Enter Sewing Received Quantity",
        name: "sewingReceivedQuantity"
    }],
    output: [{
        label: "Enter Kaja and Buttoning Done Quantity",
        name: "kajaAndButtoningDoneQuantity"
    }]
}
const KBForm = ({initialValues, process, onFinish}) => {
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
                    ({label, name}) => <Form.Item label={label} name = {name}><InputNumber inputMode="numeric"/></Form.Item>)}
                <Form.Item {...tailFormItemLayout}>
                    <Space>
                        <Button onClick = {() => history.goBack()}>Back</Button>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default KBForm