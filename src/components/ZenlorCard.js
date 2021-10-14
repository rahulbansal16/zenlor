import { Card, Space, Image, Button } from 'antd';
import zenlor from "../assets/zenlor.png"
import moment from "moment";
const { Meta } = Card;

const ZenlorCard = ({buyerName, dueDate, fabricUrl, styleCode, description, status, onClick}) => {
        return <Card
                 bordered = {true}
                //  onClick = {onClick}
                 hoverable
                 title = {styleCode.toUpperCase() + "  ||  " + buyerName }
                 style = {{
                   width:'100%',
                 }}
              >

                <Card.Grid style = {{
                  padding: "0 !imporant"
                }}>
                <Image
                  width="50%"
                  height="50%"
                  src={fabricUrl || "error" }
                  fallback={zenlor}
                />
                </Card.Grid>
                <div
                style = {{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}
                onClick = {onClick}
                >
                  <div style = {{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}>
                    <div>{moment(dueDate).format('DD-MMM-YY')}</div>
                    <div>{description}</div>
                    <Button type="primary">Update</Button>
                    {/* <Meta description = {moment(dueDate).format('DD-MMM-YY')} title = {description}/> */}
                    {/* <Button>hi</Button> */}
                    {/* <Meta description="This is the task name"/> */}
                 </div>
                </div>

                {/* <Meta  description={"Due Date " + moment(dueDate).format('MM-DD-YY')} /> */}
              </Card>;
};

export default ZenlorCard;