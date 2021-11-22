import FormLayout from "./FormLayout";
import { PROCESS_VALUE } from "../../CONSTANTS";
let dataInput = {}
dataInput[PROCESS_VALUE.SEWING.LOADING] = [{
    label: "Enter Loading Received Quantity",
    name: "loadingReceivedQuantity"
}]
dataInput[PROCESS_VALUE.SEWING.OUTPUT] = [{
    label: "Enter Sewing Done Quantity",
    name: "output"
}]
const SewingForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues = {initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default SewingForm
