import {Form, InputNumber, Button, Space} from "antd"
import { useState } from "react";
import { useHistory  } from "react-router";
import { formItemLayout, tailFormItemLayout } from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    received_from_washing: [{
        label: "Enter Washing Received Quantity",
        name: "washingReceivedQuantity"
    }],
    pre_inspection: [{
        label: "Enter Packed Quantity",
        name: "packedQuantity"
    }, {
        label: "Enter Rejected Quantity",
        name: "rejectedQuantity"
    }]
}
const PackingForm = ({initialValues, process, onFinish}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
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
                    setLoading(true)
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
                        <Button type="primary" htmlType="submit" loading={loading}>Register</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default PackingForm