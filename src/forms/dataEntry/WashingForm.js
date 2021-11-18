import FormLayout from "./FormLayout";

// StyleCode Name on the Top
const dataInput = {
    sending: [{
        label: "Enter Washing Sent Quantity",
        name: "washingSentQuantity"
    }],
    receiving:[{
        label: "Enter Washing Received Quantity",
        name: "washingReceivedQuantity"
    }],
}
const WashingForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout initialValues = {initialValues} formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default WashingForm