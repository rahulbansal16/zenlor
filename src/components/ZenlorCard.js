import { Card, Space, Image } from 'antd';
import zenlor from "../assets/zenlor.png"
import moment from "moment";
const { Meta } = Card;

const ZenlorCard = ({buyerName, dueDate, fabricUrl, styleCode, description, status, onClick}) => {
        return <Card
                 onClick = {onClick}
                 hoverable
                 title = {styleCode + "    ||    " + buyerName }
                 style = {{
                   width:'100%',
                 }}
              >

                <Card.Grid style = {{
                  padding: "0 !imporant"
                }}>
                <Image
                  width="120%"
                  src={fabricUrl || "error" }
                  fallback={zenlor}
                />
                </Card.Grid>
                <div style ={{
                  textAlign:'center',
                }}>
                <div>
                    <Meta description = {moment(dueDate).format('DD-MMM-YY')} title = {description}/>
                    {/* <Meta description="This is the task name"/> */}
                 </div>
                </div>

                {/* <Meta  description={"Due Date " + moment(dueDate).format('MM-DD-YY')} /> */}
              </Card>;
};

export default ZenlorCard;