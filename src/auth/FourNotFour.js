import { Result, Button } from "antd"
import { useHistory } from "react-router";

const FourNotFour = () => {
const history = useHistory()
 return <Result
    status="404"
    title="404"
    subTitle="Sorry, Page Not Found"
    extra={<Button type="primary" size="large" onClick = {()=> history.push('/')}>Back Home</Button>}
  />
}

export default FourNotFour;