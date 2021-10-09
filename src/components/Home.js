import { useEffect, useState } from "react";
import CONSTANTS from "../CONSTANTS";
import { fetchStyleCode } from "../firebase";
import { Card, Space } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Image } from 'antd';
import moment from "moment";

import postImage from "../assets/post48.png"
import zenlor from "../assets/zenlor.png"
import Loader from "./Loader";
const { Meta } = Card;


const PostIcon = () => {
  const history = useHistory()

  return (
    <div>
      <img
        //   className="zoom"
        alt="Create new Style Code"
        style={{ backgroundColor: "green",
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

const StyleCodeCard = ({buyerName, dueDate, fabricUrl, styleCodeName, status}) => {
  return <Card
           hoverable
           style = {{
             width:'100%'
           }}
           cover={
            <Image
            width="50%"
            src={fabricUrl || "error" }
            fallback={zenlor}
          />
          }
        >
            <Meta title={ "Buyer: " + buyerName} description={"Due Date " + moment(dueDate).format('MM-DD-YY')} />
        </Card>;
};

const Home = () => {
  const [styleCodes, setStyleCodes] = useState([]);
  const [showLoader, setShowLoader]  = useState(true)

  useEffect(() => {
    fetchStyleCode(CONSTANTS.company_id).then((responseStyleCodes) => {
      if (responseStyleCodes) {
        setStyleCodes(responseStyleCodes);
        setShowLoader(false)
      }
    });
  }, []);

  const populateStyleCodes = () => {
    console.log("The styleCodes are", styleCodes);
    return (
      <div>
        <Space align="center" wrap>
        {styleCodes.map((styleCode) => <StyleCodeCard key = {styleCode.id} {...styleCode}/> )}
        </Space>
      </div>
    );
  };

  return (
    <div style = {{
      position:'relative'
    }}>
      {showLoader && <Loader/>}
      {populateStyleCodes()}
      <PostIcon />
    </div>
  );
};

export default Home;
