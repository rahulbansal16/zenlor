import { Tag } from "antd";

const ZenlorTags = ({text}) => {
    let color = "green"
    switch(text.toLowerCase()){
        case "no order":
            color="red"
            break;
        case "partial order":
            color="yellow"
            break;
        case "full order":
            color="green"
            break;
        default:
            color="white"
    }
    return <Tag color={color}>{text}</Tag>
}

export default ZenlorTags