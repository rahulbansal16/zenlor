import { Modal, Button, Radio, Space } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import UploadFileModal from './UploadFileModal';

const AddNewModal = ({type, title, options = ['manual','csv']}) => {
    const [visible, setVisible] = useState(false)
    const [option ,setOption] = useState(null)
    const [showFileModal, setShowFileModal] = useState(false)
    const history = useHistory()
    const handleNext = () => {
        if (option === "csv"){
            setShowFileModal(true)
        } else if (option === "manual"){
            history.push(`/action/${type}/new`)
        }
    }
    return(
        <>
        <Button type="primary" onClick={() => setVisible(true)}>Add New</Button>
        <Modal
            title={`Create ${title}`}
            centered
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            footer={[
                <Button onClick={() => setVisible(false)}>Cancel</Button>,
                <Button type="primary" disabled={ option === null} onClick={handleNext}>Next</Button>
            ]}
        >


            <Radio.Group onChange={ (v) => setOption(v.target.value)} defaultValue={null}>
                <Space direction="vertical">
                    {options.map( (item) => <Radio key={item} value={item}>{item}</Radio>)}
                </Space>
            </Radio.Group>
           </Modal>
           { showFileModal?<UploadFileModal type={type} open={showFileModal}></UploadFileModal>:<></>}
        </>
    )
}
export default AddNewModal