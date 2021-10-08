import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { conditionalExpression } from '@babel/types';

const MessageBox = ({title, text, backHandler, forwardHandler, open}) => {
    console.log('The message Box value is', open)

    const handleOk = () => {
      forwardHandler()
    };

    const handleCancel = () => {
      backHandler();
    };

    return (
        <Modal visible={open} onOk={handleOk} onCancel={handleCancel}>
            {text}
        </Modal>
    )
}

export default MessageBox