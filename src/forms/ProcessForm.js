import {Form, Input, InputNumber, Button, Space, Select} from "antd"
import { formItemLayout, tailFormItemLayout} from "./dataEntry/FormLayout";
import { useState } from "react";
import { useHistory } from "react-router";
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
    const [styleCode, setStyleCode] = useState()
    const history = useHistory()

    const onFinish = (value) => {
        console.log("The value of the form is", value)
        const {styleCode, process} = value
        history.push({
            pathname:`/${department}/form`,
            search:`styleCode=${styleCode||123}&process=${process}`
        })
    }

    return (<div>
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
                    <Form.Item label="1. Enter the StyleCode">
                        <StyleCodeInput onSelectCb={setStyleCode} styleCodes={[]}/>
                    </Form.Item>
                    <Form.Item label="2. Choose Process" name="process">
                        <Select
                            placeholder="Select Process"
                            onChange={()=>{}}
                            allowClear
                          >
                              {process[department].map( (item,idx) => <Option value = {item.value}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                    <Space>
                        <Button onClick = {() => history.goBack()}>Back</Button>
                        <Button type="primary" htmlType="submit">Next</Button>
                    </Space>
                </Form.Item>
            </Form>
    </div>)
}
export default ProcessForm