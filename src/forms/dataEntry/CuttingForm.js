import FormLayout from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    fabric_in: [{
        label: "Enter Fabric Issued Quantity",
        name: "fabricIssued"
    }],
    cutting: [{
        label: "Enter Cutting Done Quantity",
        name: "cutQuantity"
    }]
}
const CuttingForm = ({initialValues, process, onFinish}) => {
    return (
        <FormLayout formFields = {dataInput[process]} onFinish = {onFinish}/>
    )
}

export default CuttingForm