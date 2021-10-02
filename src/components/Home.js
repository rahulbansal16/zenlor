import { useEffect, useState } from "react";
import CONSTANTS from "../CONSTANTS";
import { fetchStyleCode } from "../firebase";
import { Card, Space } from 'antd';
import { Link, useHistory } from 'react-router-dom';

import postImage from "../assets/post48.png"
const { Meta } = Card;


const PostIcon = () => {
  const history = useHistory()

  return (
    <div>
      <img
        //   className="zoom"
        alt="Create new Style Code"
        style={{ backgroundColor: "black",
         position:'fixed',
          borderRadius:'24px',
          bottom: '40px',
          right:'20px'

        }}
        onClick={
          () => {
            history.push('/stylecode')
          }
        }
        src={postImage}
        />
    </div>
  );
};

const StyleCodeCard = ({imageSrc, styleCodeName, status}) => {
  return <Card
           hoverable
           cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>;
};

const Home = () => {
  const [styleCodes, setStyleCodes] = useState(["r", "b"]);

  useEffect(() => {
    fetchStyleCode(CONSTANTS.company_id).then((responseStyleCodes) => {
      if (responseStyleCodes) setStyleCodes(responseStyleCodes);
    });
  }, []);

  const populateStyleCodes = () => {
    console.log("The styleCodes are", styleCodes);
    return (
      <div>
        <Space wrap>
        {styleCodes.map((styleCode) => <StyleCodeCard/> )}
        </Space>
      </div>
    );
  };

  return (
    <div style = {{
      position:'relative'
    }}>
      {populateStyleCodes()}
      <PostIcon />
    </div>
  );
};

export default Home;
