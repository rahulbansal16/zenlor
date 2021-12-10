import { Button } from "antd"
import { useHistory, useLocation } from "react-router"
import { functions } from "../firebase"
import { getCurrentTime } from "../util"
import FormLoader from "./FormLoader"

const EditForm = ({department}) => {

    const history = useHistory()
    const location = useLocation()
    const search = useLocation().search
    const id = new URLSearchParams(search).get("id");
    const lineNumber = new URLSearchParams(search).get("lineNumber")
    const onDeleteHandler = async () => {
        console.log("Deleting the update for the id", id, department);
        let updateData = functions.httpsCallable('updateData')
        const body = {
            department,
            id,
            status:"deleted",
            modifiedAt: getCurrentTime(),
            json: {}
          };
          await updateData(body)
          history.push(`/${department}?lineNumber=${lineNumber}`)
          window.location.reload();

    }

    const deleteButton = () => {
        return (
            <div>
                <Button danger onClick = {onDeleteHandler}> Delete</Button>
            </div>
        )
    }
    return (
        <div>
            <FormLoader initialValues={location.state} department = {department} header={deleteButton} ></FormLoader>
        </div>
    )
}
export default EditForm