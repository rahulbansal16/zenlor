import {Form, Button, Space, Select} from "antd"
import { formItemLayout, tailFormItemLayout} from "./dataEntry/FormLayout";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import StyleCodeInput from "./StyleCodeInput";
import DepartmentHeader from "./DepartmentHeader";
import {PROCESS_NAME, PROCESS_VALUE} from "../CONSTANTS"
import { useSelector } from "react-redux";
const { Option } = Select;

const {CUTTING, SEWING, KAJJAANDBUTTONING, WASHING, PACKING} = PROCESS_NAME

const ProcessForm = ({department}) => {
    const [form] = Form.useForm();
    const search = useLocation().search
    const lineNumber = new URLSearchParams(search).get("lineNumber");
    const process = useSelector( state => {
      const departmentsData = state.taskReducer.form;
      const departmentData = departmentsData.filter( data => data.id === department)[0]
      return departmentData["process"]
    })

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
                            autoFocus
                            onChange={()=>{}}
                            allowClear
                          >
                              {process.map( (item,idx) => <Option size="large" value = {item}>{item}</Option>)}
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