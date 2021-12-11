import { Button, Card } from "antd"
import { useHistory} from "react-router"
import { appendToPath } from "../util"
import { useState } from "react"
import { EditOutlined} from "@ant-design/icons";

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

const UpdateCard = ({id, styleCodeId, styleCode, createdAt, updatedAt, process, data, total, lineNumber}) => {
    console.log("The total is", total)
    const history = useHistory()
    const [loading, setLoading] = useState(false);
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
        let keys =[]
        let values = []
        let output = []
        for (let key in data){
            keys.push(key)
            values.push(data[key])
            output.push(
                <div className="fx-sp-bt">
                    <div id ="key" style={{fontWeight:20}}>{key}</div>
                    <div><div>
                        {data[key]} | {total[key]}
                        </div>
                    </div>
                </div>
                )
        }
        return output
    }
    return <Card
        key = {styleCodeId}
        title = {<CardTitle styleCode={styleCode} process={process}/>}
        bordered={true}
        hoverable
        actions={
            [
                // <Button danger className="wd-100"size="medium">Delete</Button>,
                <Button icon={<EditOutlined />} type="link" className="wd-100"size="medium" onClick={onClick}>Update</Button>
            ]
        }
        style={{
            width: "100%",
            marginBottom:'10px'
          }}
    >
        <div>
            <div className="txt-al-left" style={{fontWeight:20}}>
                Updated At {createdAt}
            </div>
            {printValue(data)}
        </div>
    </Card>
}

export default UpdateCard