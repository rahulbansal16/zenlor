import {Form, Input, InputNumber, Button, Space} from "antd"
import { useHistory, useLocation  } from "react-router";
import { formItemLayout, tailFormItemLayout } from "./FormLayout";

const dataInput = {
    loading: [{
        label: "Enter Loading Received Quantity",
        name: "loadingReceivedQuantity"
    }],
    line_output:[{
        label: "Enter Sewing Done Quantity",
        name: "sewingDoneQuantity"
    }],
}
const SewingForm = ({initialValues, process, onFinish}) => {
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
export default SewingForm
