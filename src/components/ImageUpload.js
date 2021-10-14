import { Upload } from 'antd';
import { FileImageFilled, PlusOutlined} from '@ant-design/icons';
import { useState } from 'react';
import {storage} from '../firebase'
import { generateUId } from '../util';
import CONSTANTS from '../CONSTANTS'

const UploadButton = () => (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

const ImageUpload = ({onSuccessHandler}) => {

  const [loading, setLoading] = useState(false);
  const[imageUrl, setImageUrl] = useState("");

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      // this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // getBase64(info.file.originFileObj, imageUrl => this.setState({
      //   imageUrl,
      //   loading: false
      // }));
    }
  };
    const beforeUpload = (file) => {
      const isImage = file.type.indexOf('image/') === 0;
      if (!isImage) {
        // AntMessage.error('You can only upload image file!');
      }

      // You can remove this validation if you want
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        // AntMessage.error('Image must smaller than 5MB!');
      }
      return isImage && isLt5M;
    };
    const customUpload = async ({ onError, onSuccess, file }) => {
      const metadata = {
          contentType: 'image/jpeg'
      }
      const storageRef = storage;
      const imageName = generateUId('', 12) //a unique name for the image
      const imgFile = storageRef.child(`stylecodes/${CONSTANTS.companyId}/${imageName}.png`);
      try {
        const image = await imgFile.put(file, metadata);
        const URL = await imgFile.getDownloadURL();
        onSuccess()
        onSuccessHandler(URL);
      } catch(e) {
        console.log('Error uploading the image', e)
        onError(e);
      }
    };

    return (<>
    <Upload
      listType="picture-card"
    //   defaultFileList={[...fileList]}
      onChange = {handleChange}
      beforeUpload = {beforeUpload}
      customRequest = {customUpload}
      className="upload-list-inline"
    >
        <UploadButton/>
    </Upload>
    </>)
}

export default ImageUpload