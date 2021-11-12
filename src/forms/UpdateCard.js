import { Card } from "antd"

const UpdateCard = ({styleCodeName, updatedAt}) => {
    return <Card
        bordered={true}
        hoverable
        style={{
            width: "100%",
            marginBottom:'10px'
          }}
    >
        {styleCodeName}

    </Card>
}

export default UpdateCard