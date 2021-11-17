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

const UpdateCard = ({styleCodeId, styleCode, createdAt, updatedAt, process}) => {
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
        Task Updated At {createdAt}
    </Card>
}

export default UpdateCard