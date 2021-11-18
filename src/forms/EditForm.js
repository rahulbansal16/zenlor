import { Button } from "antd"
import { useHistory, useLocation } from "react-router"
import FormLoader from "./FormLoader"

const EditForm = ({department}) => {

    const location = useLocation()
    const search = useLocation().search
    const id = new URLSearchParams(search).get("id");

    const onDeleteHandler = () => {
        console.log("Deleting the update for the id", id, department);
    }

    const deleteButton = () => {
        return (
            <div>
                <Button danger onClick = {onDeleteHandler}> Delete</Button>
            </div>
        )
    }
    // location.state

    return (
        <div>
            <FormLoader initialValues={location.state} department = {department} header={deleteButton} ></FormLoader>
        </div>
    )
}
export default EditForm