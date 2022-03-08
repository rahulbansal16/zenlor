import { UploadOutlined } from "@ant-design/icons"
import { Button, Modal, notification, Upload } from "antd"
import { useState } from "react"
import { csvToJson } from "../util"
import {functions} from "../firebase"
import { useSelector } from "react-redux"

const UploadFileModal = ({type, open, onCancel, onCloseModal}) => {
    const company = useSelector(state => state.taskReducer.user.company)
    const [fileList, setFileList] = useState([])
    const [uploading, setUploading] = useState(false)

    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    const insertData = async (type, json) => {
        let methodName = ""
        let payload = {
            company 
        }
        switch(type){
            case "dashboard":
                methodName = "upsertStyleCodesInfo"
                payload["styleCodes"] = json
                break;
            case "purchaseOrder":
                methodName = "upsertCreatePO"
                payload["purchaseMaterials"] = json
                break;
            case "orderMaterials":
                methodName = "upsertBOMInfo"
                payload["boms"] = json
                break;
            case "inwardMaterial":
                break;
            default:
        }
        if (methodName){
            const result = await functions.httpsCallable(methodName)(payload)
            return result;
        }
        setUploading(false)
    }

    const handleUpload = () => {
        setUploading(true)
        const file = fileList[0]
        console.log("The file is", file)
        getBase64(file).then (async data => {
            const json = csvToJson(data)
            await insertData(type, json)
            notification["success"]({
                message: "File Uploaded",
                description: "Enteries are entered into the System"
            })
            setUploading(false)
            onCloseModal(false)
            onCancel()
            window.location.reload()
        }).catch(e => {
            console.log("There is an error in uploading the file",e)
            notification["error"]({
                message: "File upload Failed",
                description: "Error" + e
            })
            setUploading(false)
        })
        setFileList([])
    }

    const props = {
      onRemove: file => {
        setFileList( (fileList) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            return newFileList
        })
      },
      beforeUpload: file => {
        setFileList( fileList =>  [...fileList, file])
        return false;
      },
      fileList,
    };

    return (
        <Modal
        title={`Upload File`}
        centered
        visible={open}
        onOk={() => onCloseModal(false)}
        onCancel={() => onCloseModal()}
        footer={[
            <Button onClick={() => onCloseModal(false)}>Cancel</Button>,
            <Button type="primary" onClick={handleUpload} disabled={fileList.length === 0} loading={uploading}>Next</Button>
        ]}>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <br></br>
            Download <a  target="_blank" rel="noreferrer" href="https://docs.google.com/spreadsheets/d/1bOTOm4xT00Rnqse0MMM567Q7SmBop7MgfMIRgiAMMr8/edit#gid=229857902">csv</a> template
        </Modal>
    )
}

export default UploadFileModal