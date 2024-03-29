import { Card, Image, Button, Tag } from "antd";
import { RightOutlined} from '@ant-design/icons';
import zenlor from "../assets/zenlor.png";
import moment from "moment";
import TaskDelay from "./TaskDelay";

const CardTitle = ({styleCode, buyerName}) => {
  return (
    <div style = {{display:'flex', justifyContent:'space-between'}}>
      <h4>
        {(styleCode || "").toUpperCase()}
      </h4>
      <h4>
        {buyerName}
      </h4>
    </div>
  )
}

const ZenlorCard = ({
  buyerName,
  dueDate,
  fabricUrl,
  styleCode,
  description,
  status,
  onClick,
}) => {
  return (
    <Card
      bordered={true}
      //  onClick = {onClick}
      hoverable
      title={<CardTitle styleCode={styleCode} buyerName={buyerName}/>}
      style={{
        width: "100%",
        marginBottom:'10px'
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          width="30%"
          height="20%"
          src={fabricUrl || "error"}
          fallback={zenlor}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
          onClick={onClick}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <TaskDelay dueDate = {dueDate}/>
            {/* <div><Tag color="red">{moment(dueDate).format("DD-MMM-YY")}</Tag></div> */}
            <div>{description}</div>
            <Button type="primary">Update <RightOutlined /></Button>
            {/* <Meta description = {moment(dueDate).format('DD-MMM-YY')} title = {description}/> */}
            {/* <Button>hi</Button> */}
            {/* <Meta description="This is the task name"/> */}
          </div>
        </div>
      </div>

      {/* <Meta  description={"Due Date " + moment(dueDate).format('MM-DD-YY')} /> */}
    </Card>
  );
};

export default ZenlorCard;
