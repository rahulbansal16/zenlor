import FormLayout from "./FormLayout";
import { PROCESS_VALUE } from "../../CONSTANTS";
let dataInput = {}
dataInput[PROCESS_VALUE.CUTTING.FABRIC_ISSUED] = [{
    label: "Enter Fabric Issued Quantity",
    name: "fabricIssued"
}]
dataInput[PROCESS_VALUE.CUTTING.OUTPUT] = [{
    label: "Enter Cutting Done Quantity",
    name: "output"
}]
const CuttingForm = ({initialValues, process, onFinish}) => {
    return (
        <FormLayout initialValues={initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>
    )
}

export default CuttingForm