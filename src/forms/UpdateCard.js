import { Card } from "antd"

const UpdateCard = ({styleCodeId, styleCode, updatedAt}) => {
    return <Card
        key = {styleCodeId}
        bordered={true}
        hoverable
        style={{
            width: "100%",
            marginBottom:'10px'
          }}
    >
        {styleCode}

    </Card>
}

export default UpdateCard