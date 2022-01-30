import { Button, Form, Radio, Space } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import DateSelector from "../components/DateSelector";
import { formItemLayout } from "./dataEntry/FormLayout";
import DepartmentHeader from "./DepartmentHeader";
import StyleCodeInput from "./StyleCodeInput";
import { RightOutlined,CloseCircleOutlined} from "@ant-design/icons";


const ProcessForm = ({ department }) => {
  const [form] = Form.useForm();
  const search = useLocation().search;
  const lineNumber = new URLSearchParams(search).get("lineNumber");
  const process = useSelector((state) => {
    const departmentsData = state.taskReducer.form;
    const departmentData = departmentsData.filter(
      (data) => data.id === department
    )[0];
    return departmentData["process"];
  });

  const [styleCode, setStyleCode] = useState();
  const [day, setDay] = useState(0);
  const history = useHistory();

  const onFinish = (value, materialIssue) => {
    console.log("The value of the form is", value, materialIssue);
    const { styleCode, process } = value;
    history.push({
      pathname: `/${department}/form`,
      search: `styleCode=${styleCode || 123}&process=${process}&lineNumber=${
        lineNumber || 1
      }&day=${day}`,
    });
  };

  const checkStyleCode = (value) => {
    if (!styleCode)
      return Promise.reject(new Error("Please Select the StyleCode"));
    else return Promise.resolve();
  };

  return (
    <div>
      <DepartmentHeader department={department} lineNumber={lineNumber} />
      <DateSelector onChange={setDay}/>
      <Form
        {...formItemLayout}
        style={{
          marginLeft: "8px",
          marginRight: "8px",
        }}
        className="mg-y"
        size="large"
        name="styleCodeEditor"
        align="left"
        labelAlign="left"
        onFinish={(data, materialIssue) => {
          console.log(data);
          data["styleCode"] = styleCode;
          onFinish(data, materialIssue);
        }}
      >
        <Form.Item
          name="radio-group"
          label="1. Choose Process"
          name="process"
          rules={[
            {
              required: true,
              message: "Please Choose the Process",
            },
          ]}
        >
          <Radio.Group>
            <Space direction="vertical">
              {process.map((item, idx) => (
                <Radio value={item}>{item.toUpperCase()}</Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="2. Choose the StyleCode"
          name="styleCodeInput"
          rules={[
            {
                required: true,
              validator: checkStyleCode,
            },
          ]}
        >
          <StyleCodeInput onSelectCb={setStyleCode} />
        </Form.Item>
        <div className="fx-sp-bt wd-100">
          <Button icon={<CloseCircleOutlined />} danger onClick={() => history.goBack()} className="wd-45">
            Cancel
          </Button>
          <Button icon ={<RightOutlined />}type="primary" htmlType="submit" className="wd-45">
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default ProcessForm;
