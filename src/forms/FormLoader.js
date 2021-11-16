import { useHistory, useLocation  } from "react-router";
import { functions } from "../firebase";
import CuttingForm from "./dataEntry/CuttingForm";
import SewingForm from "./dataEntry/SewingForm";
import KBForm from "./dataEntry/KBForm";
import WashingForm from "./dataEntry/WashingForm";
import PackingForm from "./dataEntry/PackingForm";
import DepartmentHeader from "./DepartmentHeader";
import ProcessHeader from "./ProcessHeader";

const loadForm = (department, process, onFinish) => {
    switch(department){
        case "cutting":
            return <CuttingForm onFinish = {onFinish} process = {process} />
        case "sewing":
            return <SewingForm onFinish = {onFinish} process = {process}/>
        case "kajjaandbuttoning":
            return <KBForm onFinish = {onFinish} process = {process} />
        case "washing":
            return <WashingForm onFinish = {onFinish} process = {process} />
        case "packing":
            return <PackingForm onFinish = {onFinish} process = {process} />
        default:
            return <></>
    }
}
const FormLoader = ({department}) => {

    const search = useLocation().search
    const styleCode = new URLSearchParams(search).get("styleCode");
    const process = new URLSearchParams(search).get("process")
    let lineNumber = new URLSearchParams(search).get("lineNumber")
    const history = useHistory()

    console.log("The styleCode is", styleCode, process)

    const onFinish = async (value) => {
        console.log("Calling onFinish", value)
        console.log("Will submit the values now")
        let createData = functions.httpsCallable('addData')
        if (lineNumber === "null" || !lineNumber || lineNumber === null){
            lineNumber = undefined
        }
        const body = { department, json: {...value, styleCode, process, lineNumber}}
        console.log("The body is", body)
        await createData(body)
        history.push(`/${department}?lineNumber=${lineNumber}`)
        window.location.reload();
    }
    return (
        <div>
            <DepartmentHeader department={department} lineNumber={lineNumber}/>
            <ProcessHeader process={process}/>
            {/* {department.toUpperCase() + " " + process.toUpperCase()} */}
            <div className = "mg-y">
                {loadForm(department, process, onFinish)}
            </div>
        </div>
    )

}
export default FormLoader