import { useHistory, useLocation  } from "react-router";
import { functions } from "../firebase";
import CuttingForm from "./dataEntry/CuttingForm";
import SewingForm from "./dataEntry/SewingForm";
import KBForm from "./dataEntry/KBForm";
import WashingForm from "./dataEntry/WashingForm";
import PackingForm from "./dataEntry/PackingForm";
import DepartmentHeader from "./DepartmentHeader";
import ProcessHeader from "./ProcessHeader";
import { getCurrentTime } from "../util";

const loadForm = (initialValues, department, process, onFinish) => {
    switch(department){
        case "cutting":
            return <CuttingForm initialValues={initialValues} onFinish = {onFinish} process = {process} />
        case "sewing":
            return <SewingForm initialValues={initialValues} onFinish = {onFinish} process = {process}/>
        case "kajjaandbuttoning":
            return <KBForm initialValues={initialValues} onFinish = {onFinish} process = {process} />
        case "washing":
            return <WashingForm initialValues = {initialValues} onFinish = {onFinish} process = {process} />
        case "packing":
            return <PackingForm initialValues = {initialValues} onFinish = {onFinish} process = {process} />
        default:
            return <></>
    }
}
const FormLoader = ({initialValues, department, header = () => {}}) => {

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
          department,
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
        history.push(`/${department}?lineNumber=${lineNumber}`)
        window.location.reload();
    }
    return (
        <div>
            <DepartmentHeader department={department} lineNumber={lineNumber}/>
            <ProcessHeader process={process}/>
            {header()}
            <div className = "mg-y">
                {loadForm(initialValues, department, process, onFinish)}
            </div>
        </div>
    )

}
export default FormLoader