import FormLayout from "./FormLayout";
import { PROCESS_VALUE } from "../../CONSTANTS";
let dataInput = {}
dataInput[PROCESS_VALUE.WASHING.SENDING] = [{
    label: "Enter Washing Sent Quantity",
    name: "washingSentQuantity"
}]
dataInput[PROCESS_VALUE.WASHING.RECEIVING] = [{
    label: "Enter Washing Received Quantity",
    name: "washingReceivedQuantity"
}]
const WashingForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues = {initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default WashingForm