import FormLayout from "./FormLayout";

const dataInput = {
    loading: [{
        label: "Enter Loading Received Quantity",
        name: "loadingReceivedQuantity"
    }],
    line_output:[{
        label: "Enter Sewing Done Quantity",
        name: "sewingDoneQuantity"
    }],
}

const SewingForm = ({initialValues, process, onFinish}) => {
    return (<FormLayout formFields = {dataInput[process]} onFinish = {onFinish}/>)
}

export default SewingForm
