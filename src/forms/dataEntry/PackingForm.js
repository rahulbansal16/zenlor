import FormLayout from "./FormLayout";
import { PROCESS_VALUE } from "../../CONSTANTS";
let dataInput = {}

dataInput[PROCESS_VALUE.PACKING.RECEIVED_FROM_WASHING] = [{
    label: "Enter Washing Received Quantity",
    name: "washingReceivedQuantity"
}]

dataInput[PROCESS_VALUE.PACKING.PRE_INSPECTION] = [{
    label: "Enter Packed Quantity",
    name: "packedQuantity"
}, {
    label: "Enter Rejected Quantity",
    name: "rejectedQuantity"
}]

const PackingForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues = {initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default PackingForm