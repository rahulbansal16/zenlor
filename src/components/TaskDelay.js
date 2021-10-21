import {Tag} from "antd";
import moment from "moment";

const TaskDelay = ({dueDate}) => {

    const yesterday = moment().subtract(0, "days").startOf("day").valueOf()
    const tomorrow = moment().subtract(0, "days").endOf("day").valueOf()
    const diff = Math.ceil((yesterday - dueDate)/(1000*60*60*24))

    const text = (diff) => {
        if (diff >0){
            return diff + " day delay"
        }
        else if (diff === 0){
            return "on time"
        }
        return Math.abs(diff) + " day early"
    }

    return (
        <div>
            <Tag color={ diff > 0 ?"red":"green"}>{text(diff)}</Tag>
        </div>
    )
}
export default TaskDelay