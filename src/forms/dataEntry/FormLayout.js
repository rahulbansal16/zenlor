import {Form, InputNumber, Button, Space} from "antd"
import { useState } from "react";
import { useHistory  } from "react-router";

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

const FormLayout = ({initialValues, formFields, onFinish}) => {
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
                  ({label, name}, idx) => <Form.Item label={label} name = {name} key={name} rules={[{
                      required: true,
                      message: "Please Enter a value"
                  }]}><InputNumber inputMode="numeric" autoFocus={ idx === 0} /></Form.Item>)}
                  <div className = "wd-100 fx-sp-bt">
                      <Button danger onClick = {() => history.goBack()} className="wd-45">Back</Button>
                      <Button type="primary" htmlType="submit" loading={loading} className="wd-45">Register</Button>
                  </div>
          </Form>
  )

}

export default FormLayout
export  {tailFormItemLayout, formItemLayout}
