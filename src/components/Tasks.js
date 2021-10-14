import { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import ZenlorCard from "./ZenlorCard";
import { Card, Space } from 'antd';
import { functions } from "../firebase";
import CONSTANTS from "../CONSTANTS"
import Loader from "./Loader";


const Tasks = () => {
    const [tasks, setTasks] = useState([])
    const [showLoader, setShowLoader]  = useState(true)


    useEffect(() => {
        let fetchTasks = functions.httpsCallable('fetchTasks')
        const fetchData = async () => {
            const tasks = await fetchTasks({companyId: CONSTANTS.company_id})
            setTasks(tasks.data)
            setShowLoader(false)
        }
        fetchData()
    }, [])
    return (
        <div>
        {showLoader && <Loader/>}
        <Space align="center" size="middle" wrap>
            Task
            {tasks.map((task) => <ZenlorCard key = {task.id} {...task}/> )}
        </Space>
        </div>
    )
}

export default Tasks;