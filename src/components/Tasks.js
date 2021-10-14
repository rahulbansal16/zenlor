import { useEffect, useState } from "react";
import ZenlorCard from "./ZenlorCard";
import { Card, Empty, Space, Typography } from 'antd';
import { functions } from "../firebase";
import CONSTANTS from "../CONSTANTS"
import Loader from "./Loader";
import { useHistory } from "react-router";
const { Title } = Typography;


const Tasks = () => {
    const [tasks, setTasks] = useState([])
    const [showLoader, setShowLoader]  = useState(true)
    const history = useHistory()


    useEffect(() => {
        let fetchTasks = functions.httpsCallable('fetchTasks')
        const fetchData = async () => {
            const tasks = await fetchTasks({companyId: CONSTANTS.companyId})
            setTasks(tasks.data)
            setShowLoader(false)
        }
        fetchData()
    }, [])

    const onTaskClick = (styleCodeId, taskCodeId) => {
        if (!styleCodeId || !taskCodeId)
            return

        history.push(`/task/${styleCodeId}/${taskCodeId}`)
    }
    return (
        <div>
        {showLoader && <Loader/>}
        {tasks.length === 0 && !showLoader ? <Empty description="No Task For Today"/>: <Title style ={{width:'100%', textAlign:'center'}}align="middle" level={4}>Tasks For Today</Title>}
        <Space align="center" size="middle" wrap>
            {tasks.map((task) => <ZenlorCard key = {task.id} description={task.name} onClick = { () => {
                onTaskClick(task.styleCodeId, task.id)
            }} {...task}/> )}
        </Space>
        </div>
    )
}

export default Tasks;