import { Tag } from "antd";

const ZenlorTags = ({text}) => {
    let color = "green"
    switch(text){
        case "NOT_ORDERED":
            color="red"
            break;

        case "PARTIAL_ORDERED":
            color="yellow"
            break;

        case "FULLY_ORDERED":
            color="pink"
            break;

        case "ALL_IN":
            color="green"
            break;

        case "NO_BOM":
            color="blue"
            break;
        default:
            color="pink"
    }
    return <Tag color={color}>{text}</Tag>
}

export default ZenlorTags