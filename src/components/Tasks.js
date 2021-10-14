import { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import ZenlorCard from "./ZenlorCard";
import { Card, Space } from 'antd';
import { functions } from "../firebase";
import CONSTANTS from "../CONSTANTS"
import Loader from "./Loader";
import { useHistory } from "react-router";


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
        <Space align="center" size="middle" wrap>
            Task
            {tasks.map((task) => <ZenlorCard key = {task.id} onClick = { () => {
                onTaskClick(task.styleCodeId, task.id)
            }} {...task}/> )}
        </Space>
        </div>
    )
}

export default Tasks;