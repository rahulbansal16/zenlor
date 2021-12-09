import { useHistory, useLocation  } from "react-router";
import { functions } from "../firebase";
import DepartmentHeader from "./DepartmentHeader";
import ProcessHeader from "./ProcessHeader";
import { getCurrentTime } from "../util";
import { useSelector } from "react-redux";
import FormLayout from "./dataEntry/FormLayout";
import FourNotFour from "../auth/FourNotFour";

const loadForm = (initialValues, department, process, onFinish, departmentsData) => {
    const departmentData = departmentsData.filter( departmentData => departmentData.id === department)
    if (departmentData && departmentData.length > 0){
        return <FormLayout initialValues={initialValues} formFields = {departmentData[0]["form"][process.toLowerCase()]} onFinish = {onFinish}/>
    } else  {
        <FourNotFour/>
    }
    
}
const FormLoader = ({initialValues, department: departmentId, header = () => {}}) => {

    const company = useSelector(state => state.taskReducer.user.company)
    const form = useSelector( state => state.taskReducer.form)
    const search = useLocation().search
    const styleCode = new URLSearchParams(search).get("styleCode");
    const process = new URLSearchParams(search).get("process")
    let lineNumber = new URLSearchParams(search).get("lineNumber")
    const id = new URLSearchParams(search).get("id")
    const history = useHistory()

    console.log("The styleCode is", styleCode, process)

    const onFinish = async (values) => {
        console.log("Calling onFinish", values)
        console.log("Will submit the values now")
        let createData = functions.httpsCallable('addData')
        let updateData = functions.httpsCallable('updateData')
        if (lineNumber === "null" || !lineNumber || lineNumber === null){
            lineNumber = undefined
        }
        const body = {
          department: departmentId,
          companyId: company,
          id,
          createdAt: getCurrentTime(),
          modifiedAt: getCurrentTime(),
          json: { values, styleCode, process, lineNumber},
        };
        console.log("The body is", body)
        if (!id){
            await createData(body)
        } else {
            console.log('The body is', body)
            await updateData(body)
        }
        history.push(`/${departmentId}?lineNumber=${lineNumber}`)
        window.location.reload();
    }
    return (
        <div>
            <DepartmentHeader department={departmentId} lineNumber={lineNumber}/>
            <ProcessHeader process={process}/>
            {header()}
            <div className = "mg-y">
                {loadForm(initialValues, departmentId, process, onFinish, form)}
            </div>
        </div>
    )

}
export default FormLoader