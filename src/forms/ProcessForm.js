import {Form, Button, Space, Select} from "antd"
import { formItemLayout, tailFormItemLayout} from "./dataEntry/FormLayout";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import StyleCodeInput from "./StyleCodeInput";
import DepartmentHeader from "./DepartmentHeader";
import {PROCESS_NAME, PROCESS_VALUE} from "../CONSTANTS"
const { Option } = Select;

const {CUTTING, SEWING, KAJJAANDBUTTONING, WASHING, PACKING} = PROCESS_NAME
const process = {
  cutting: [
    { name: CUTTING.FABRIC_ISSUED, value: PROCESS_VALUE.CUTTING.FABRIC_ISSUED },
    { name: CUTTING.OUTPUT, value: PROCESS_VALUE.CUTTING.OUTPUT },
  ],
  sewing: [
    { name: SEWING.LOADING, value: PROCESS_VALUE.SEWING.LOADING },
    { name: SEWING.OUTPUT, value: PROCESS_VALUE.SEWING.OUTPUT },
  ],
  kajjaandbuttoning: [
    { name: KAJJAANDBUTTONING.RECEIVED_FROM_SEWING, value: PROCESS_VALUE.KAJJAANDBUTTONING.RECEIVED_FROM_SEWING },
    { name: KAJJAANDBUTTONING.OUTPUT, value: PROCESS_VALUE.KAJJAANDBUTTONING.OUTPUT },
  ],
  washing: [
    { name: WASHING.SENDING, value: PROCESS_VALUE.WASHING.SENDING },
    { name: WASHING.RECEIVING, value: PROCESS_VALUE.WASHING.RECEIVING },
  ],
  packing: [
    { name: PACKING.RECEIVED_FROM_WASHING, value: PROCESS_VALUE.PACKING.RECEIVED_FROM_WASHING },
    { name: PACKING.PRE_INSPECTION, value: PROCESS_VALUE.PACKING.PRE_INSPECTION },
  ],
};

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

    return (<div>
                <DepartmentHeader department={department} lineNumber={lineNumber}/>
                <Form
                {...formItemLayout}
                style = {{
                    marginLeft:'8px',
                    marginRight:'8px'
                }}
                className="mg-y"
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
                   
                    <Form.Item label="1. Choose Process" name="process" rules={[
                        {
                            required: true,
                            message: 'Please Choose the Process.'
                        }
                    ]}>
                        <Select
                            placeholder="Select Process"
                            size="large"
                            onChange={()=>{}}
                            allowClear
                          >
                              {process[department].map( (item,idx) => <Option size="large" value = {item.value}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="1. Choose the StyleCode" required>
                        <StyleCodeInput onSelectCb={setStyleCode}/>
                    </Form.Item>
                    <div  className = "fx-sp-bt wd-100">
                        <Button danger onClick = {() => history.goBack()} className = "wd-45">Cancel</Button>
                        <Button type="primary" htmlType="submit" className = "wd-45">Next</Button>
                    </div>
            </Form>
            </div>
    )
}
export default ProcessForm