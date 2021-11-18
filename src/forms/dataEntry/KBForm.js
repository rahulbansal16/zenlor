import FormLayout from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    received_from_sewing: [{
        label: "Enter Sewing Received Quantity",
        name: "sewingReceivedQuantity"
    }],
    output: [{
        label: "Enter Kaja and Buttoning Done Quantity",
        name: "kajaAndButtoningDoneQuantity"
    }]
}
const KBForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues={initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default KBForm