import {Form, Input, InputNumber, Button, Space} from "antd"
import { useHistory, useLocation  } from "react-router";
import { formItemLayout, tailFormItemLayout } from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    received_from_sewing: [{
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

export default PackingForm