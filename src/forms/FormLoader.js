import { useState } from "react"
import {Form, Input, InputNumber, Button, Space} from "antd"
import StyleCodeInput from "./StyleCodeInput"
import { useHistory, useLocation  } from "react-router";
import { functions } from "../firebase";
import CuttingForm from "./dataEntry/CuttingForm";
import SewingForm from "./dataEntry/SewingForm";
import KBForm from "./dataEntry/KBForm";
import WashingForm from "./dataEntry/WashingForm";
import PackingForm from "./dataEntry/PackingForm";

const loadForm = (department, process, onFinish) => {
    switch(department){
        case "cutting":
            return <CuttingForm onFinish = {onFinish} process = {process} />
        case "sewing":
            return <SewingForm onFinish = {onFinish} process = {process}/>
        case "kajjaandbuttoning":
            return <KBForm onFinish = {onFinish} process = {process} />
        case "washing":
            return <WashingForm onFinish = {onFinish} process = {process} />
        case "packing":
            return <PackingForm onFinish = {onFinish} process = {process} />
        default:
            return <></>
    }
}
const FormLoader = ({department}) => {

    const search = useLocation().search
    const styleCode = new URLSearchParams(search).get("styleCode");
    const process = new URLSearchParams(search).get("process")

    console.log("The styleCode is", styleCode, process)

    const onFinish = async (value) => {
        console.log("Calling onFinish", value)
        console.log("Will submit the values now")
        let createData = functions.httpsCallable('createData')
        await createData(value)
    }
    return (
        <div>
            {department + " FormLoader"}
            {loadForm(department, process, onFinish)}
        </div>
    )

}
export default FormLoader