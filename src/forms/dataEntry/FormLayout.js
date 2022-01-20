import {Form, InputNumber, Button, Space} from "antd"
import { useState } from "react";
import { useHistory  } from "react-router";
import { CheckOutlined, LeftOutlined} from "@ant-design/icons";
import AutoCompleteSelector from "../AutoCompleteSelector";
import { useSelector } from "react-redux";

const formItemLayout = {
    labelCol: {
      xs: {
        span: 20,
        // offset:2
      },
      sm: {
        span: 20,
      },
    },
    wrapperCol: {
      xs: {
        span: 20,
        // offset:2
      },
      sm: {
        span: 20,
        // offset:2
      },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        // offset: 2,
      },
      sm: {
        span: 24,
        // offset: 2,
      },
    },
  };

const inputField = (type, idx, autoSuggestData) => {
  if (!type)
    return (
      <InputNumber inputMode="numeric" autoFocus={idx === 0} size="large" />
    );

  if (type === "autosuggest")
    return AutoCompleteSelector({
      onSelectCb: () => {},
      data: autoSuggestData,
      // data: [{ id: 12, name: "v", value: "2" }, "b", "c"],
      label: "Choose the Value",
    });
};

const FormLayout = ({initialValues, formFields, onFinish, styleCode}) => {
  const bomsInfo = useSelector(state => state.taskReducer.orderMaterials.dataSource)
  console.log("The bomsInfo", bomsInfo, styleCode);
  const materials = bomsInfo.filter(item => item.styleCode === styleCode).map( item => ({
      id: item.materialId,
      value: item.materialId,
      name: item.materialId
  }))
  console.log("The materials are ", materials);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  return (
          <Form
              {...formItemLayout}
              style = {{
                  marginLeft:'8px',
                  marginRight:'8px'
              }}
              initialValues={initialValues || {}}
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
              {formFields.map (
                  ({label, field:name, type}, idx) => <Form.Item label={label} name ={name} key={idx} rules={[{
                      required: true,
                      message: "Please Enter a value"
                  }]}>{inputField(type, idx, materials)}</Form.Item>)}
                  <div className = "wd-100 fx-sp-bt">
                      <Button danger onClick = {() => history.goBack()} className="wd-45" icon={<LeftOutlined/>}>Back</Button>
                      <Button type="primary" htmlType="submit" loading={loading} className="wd-45" icon={<CheckOutlined />} >Submit</Button>
                  </div>
          </Form>
  )

}

export default FormLayout
export  {tailFormItemLayout, formItemLayout}
