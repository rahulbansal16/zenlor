import FormLayout from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    received_from_washing: [{
        label: "Enter Washing Received Quantity",
        name: "washingReceivedQuantity"
    }],
    pre_inspection: [{
        label: "Enter Packed Quantity",
        name: "packedQuantity"
    }, {
        label: "Enter Rejected Quantity",
        name: "rejectedQuantity"
    }]
}
const PackingForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues = {initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default PackingForm