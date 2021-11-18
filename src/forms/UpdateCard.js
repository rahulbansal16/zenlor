import create from "@ant-design/icons/lib/components/IconFont"
import { Card } from "antd"

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

const UpdateCard = ({styleCodeId, styleCode, createdAt, updatedAt, process, data}) => {
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
                    <div>{data[key]}</div>
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