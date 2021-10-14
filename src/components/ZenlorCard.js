import { Card, Space, Image } from 'antd';
import zenlor from "../assets/zenlor.png"
import moment from "moment";
const { Meta } = Card;

const ZenlorCard = ({buyerName, dueDate, fabricUrl, styleCodeName, status, onClick}) => {
        return <Card
                 onClick = {onClick}
                 hoverable
                 title = {"Buyer: " + buyerName }
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
                    <Meta title = {"Due Date " + moment(dueDate).format('DD-MMM-YY')} description = {"This is th task"}/>
                    {/* <Meta description="This is the task name"/> */}
                 </div>
                </div>

                {/* <Meta  description={"Due Date " + moment(dueDate).format('MM-DD-YY')} /> */}
              </Card>;
};

export default ZenlorCard;