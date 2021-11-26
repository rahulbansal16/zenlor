import { Result, Button } from "antd"
import { useHistory } from "react-router";

const UnAuthorized = () => {
const history = useHistory()
 return <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page. Please Contact Your Manager."
    extra={<Button type="primary" onClick = {()=> history.push('/')}>Back Home</Button>}
  />
}

export default UnAuthorized;