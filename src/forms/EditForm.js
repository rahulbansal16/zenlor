import { Button } from "antd"
import { useHistory, useLocation } from "react-router"
import FormLoader from "./FormLoader"

const EditForm = ({department}) => {
    const location = useLocation()
    console.log("The state is", location.state)
    // location.state

    return (
        <div>
            <Button>fdfd</Button>
            <FormLoader initialValues={location.state} department = {department}></FormLoader>
        </div>
    )
}
export default EditForm