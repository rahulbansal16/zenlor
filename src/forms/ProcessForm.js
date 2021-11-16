import {Form, Button, Space, Select} from "antd"
import { formItemLayout, tailFormItemLayout} from "./dataEntry/FormLayout";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import StyleCodeInput from "./StyleCodeInput";
const { Option } = Select;


const process = {
    cutting: [ {name: "Fabric In", value:"fabric_in"}, {name: "Cutting", value: "cutting"}],
    sewing: [{name: "Loading", value: "loading" }, { name:"Line Output", value: "line_output"}],
    kajjaandbuttoning: [{name: "Received From Sewing", value: "received_from_sewing"}, { name: "Output", value:"output" }],
    washing: [{name: "Sending", value:"sending"}, {name: "Receiving", value: "receiving"}],
    packing: [{name: "Received From Washing", value: "received_from_washing"}, {name: "Pre Inspection", value: "pre_inspection"}]
}

const ProcessForm = ({department}) => {
    const [form] = Form.useForm();
    const search = useLocation().search
    const lineNumber = new URLSearchParams(search).get("lineNumber");

    const [styleCode, setStyleCode] = useState()
    const history = useHistory()

    const onFinish = (value) => {
        console.log("The value of the form is", value)
        const {styleCode, process} = value
        history.push({
            pathname:`/${department}/form`,
            search:`styleCode=${styleCode||123}&process=${process}&lineNumber=${lineNumber||1}`
        })
    }

    return (
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
                    data["styleCode"] = styleCode
                    onFinish(data)
                }}
                >
                    <Form.Item label="1. Enter the StyleCode" required>
                        <StyleCodeInput onSelectCb={setStyleCode}/>
                    </Form.Item>
                    <Form.Item label="2. Choose Process" name="process" rules={[
                        {
                            required: true,
                            message: 'Please Choose the Process.'
                        }
                    ]}>
                        <Select
                            placeholder="Select Process"
                            onChange={()=>{}}
                            allowClear
                          >
                              {process[department].map( (item,idx) => <Option value = {item.value}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <div  className = "fx-sp-bt wd-100">
                        <Button danger onClick = {() => history.goBack()} className = "wd-45">Back</Button>
                        <Button type="primary" htmlType="submit" className = "wd-45">Next</Button>
                    </div>
            </Form>
    )
}
export default ProcessForm