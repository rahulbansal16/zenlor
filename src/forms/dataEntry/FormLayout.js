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

const inputField = (name, idx, autoSuggestData) => {
  if (name === "autosuggestkey")
    return AutoCompleteSelector({
    onSelectCb: () => {},
    data: autoSuggestData,
    label: "Choose the Value",
  });
    return (
      <InputNumber inputMode="numeric" autoFocus={idx === 0} size="large" />
    );
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
  // const [fieldName, setFieldName] = useState("default");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const processInitialValue = (value) => {
    if(!value){
      return {}
    }
    const firstKey = Object.keys(value)?.[0];
    if (firstKey && firstKey.startsWith('.')){
      return {
        'autosuggestkey': firstKey.substring(1),
        'autosuggestvalue': value[firstKey]
      }
    }
    return value || {}
  }
  return (
          <Form
              {...formItemLayout}
              style = {{
                  marginLeft:'8px',
                  marginRight:'8px'
              }}
              initialValues={processInitialValue(initialValues)}
              size="large"
              name="styleCodeEditor"
              align="left"
              labelAlign="left"
              onFinish={(data) => {
                  console.log(data);
                  setLoading(true)
                  if (data["autosuggestkey"]){
                    let obj = {}
                    obj['.'+data["autosuggestkey"]] = data["autosuggestvalue"]
                    onFinish(obj)
                  } else {
                    onFinish(data)
                  }
              }}
          >
              {formFields.map (
                  ({label, field:name }, idx) => <Form.Item label={label} name ={name} key={idx} rules={[{
                      required: true,
                      message: "Please Enter a value"
                  }]}>{inputField(name, idx, materials)}</Form.Item>)}
                  <div className = "wd-100 fx-sp-bt">
                      <Button danger onClick = {() => history.goBack()} className="wd-45" icon={<LeftOutlined/>}>Back</Button>
                      <Button type="primary" htmlType="submit" loading={loading} className="wd-45" icon={<CheckOutlined />} >Submit</Button>
                  </div>
          </Form>
  )

}

export default FormLayout
export  {tailFormItemLayout, formItemLayout}
