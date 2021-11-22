import FormLayout from "./FormLayout";
import { PROCESS_VALUE } from "../../CONSTANTS";
let dataInput = {}
dataInput[PROCESS_VALUE.KAJJAANDBUTTONING.RECEIVED_FROM_SEWING] = [{
    label: "Enter Sewing Received Quantity",
    name: "sewingReceivedQuantity"
}]
dataInput[PROCESS_VALUE.KAJJAANDBUTTONING.OUTPUT] = [{
    label: "Enter Kaja and Buttoning Done Quantity",
    name: "output"
}]
// StyleCode Name on the Top
const KBForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues={initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default KBForm