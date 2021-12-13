import { Button, Card } from "antd"
import { useHistory} from "react-router"
import { appendToPath, formatDate } from "../util"
import { useState } from "react"
import { EditOutlined} from "@ant-design/icons";
import moment from "moment";

const CardTitle = ({styleCode, process}) => {
    return (
      <div className="fx-sp-bt">
        <div>
          {(styleCode || "").toUpperCase()}
        </div>
        <div>
          {(process || "").toUpperCase()}
        </div>
      </div>
    )
  }

const UpdateCard = ({id, styleCodeId, styleCode, createdAt, enteredAt, updatedAt, process, data, total, lineNumber}) => {
    console.log("The total is", total)
    const history = useHistory()
    const onClick = () => {
        history.push({
            pathname: appendToPath(history, '/form/edit'),
            search: `?process=${process}&styleCode=${styleCode}&lineNumber=${lineNumber}&id=${id}`,
            state: {
                ...data
            }
        })
    }
    const printValue = (data) => {
        let keys = Object.keys(data).sort()
        let output = []
        for (let key of keys){
            output.push(
                <div className="fx-sp-bt">
                    <div id ="key" style={{fontWeight:20}}>{key}</div>
                    <div>
                        {data[key]} | {total[key]}
                    </div>
                </div>
                )
        }
        return output
    }
    const parseDate = (enteredAt, createdAt) => {
        if (!enteredAt)
            return { createdAt: formatDate(createdAt), color:"primary"}
        if (enteredAt !== createdAt){
            return {createdAt: formatDate(createdAt).substring(0,12) + " Late Entry", color:"danger"}
        }
        return  { createdAt: formatDate(createdAt), color:"primary" }
    }
    const {createdAt: date, color} = parseDate(enteredAt, createdAt)
    return <Card
        key = {styleCodeId}
        title = {<CardTitle styleCode={styleCode} process={process}/>}
        bordered={true}
        hoverable
        actions={
            [
                <Button type="round" color="blue"style={{backgroundColor:"lightblue"}} className="outline wd-100">{date}</Button>,
                <Button icon={<EditOutlined />} type="link" className="outline wd-100" onClick={onClick}>Update</Button>
            ]
        }
        style={{
            width: "100%",
            marginBottom:'20px',
            // border:"solid 0.25px",
            boxShadow: "1px 1px 5px #000000"
          }}
    >
        <div>
            {printValue(data)}
            <div className="txt-al-left" style={{fontWeight:20}}>
            </div>
        </div>
    </Card>
}

export default UpdateCard