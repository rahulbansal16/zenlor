import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const MessageBox = ({title, text, backHandler, forwardHandler, open}) => {
    const [isModalVisible, setIsModalVisible] = useState(open);

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = () => {
      setIsModalVisible(false);
      forwardHandler()
    };

    const handleCancel = () => {
      setIsModalVisible(false);
      backHandler();
    };

    return (
        <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            {text}
        </Modal>
    )
}

export default MessageBox