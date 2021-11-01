import { useEffect, useState } from "react";
import ZenlorCard from "./ZenlorCard";
import Loader from "./Loader";
import { useHistory, useLocation} from "react-router";
import { Input } from 'antd';

const Tasks = ({tasks}) => {
    const [results, setResults] = useState(tasks)
    const {search} = useLocation()
    const [showLoader, setShowLoader]  = useState(tasks.length === 0)
    const history = useHistory()

     useEffect(() => {
         console.log("In the useEffect")
        setResults(tasks)
        setShowLoader(tasks.length === 0)
    }, [tasks])

    useEffect( () => {
        const q=new URLSearchParams(search).get("q");
        console.log("The value o f the q is", q)
        if(q)
            onSelect(q)
    },[tasks])

    const onTaskClick = (styleCodeId, taskCodeId) => {
        if (!styleCodeId || !taskCodeId)
            return

        history.push(`/task/${styleCodeId}/${taskCodeId}`)
    }

    const filterTasks = (term) => {
        if (term.length === 0 || term === ""){
            return tasks
        }
        term = term.trim()
        const keys = term.toUpperCase().split(' ')
        const scoredTasks =  tasks.map(task  => {
            const {buyerName, name, styleCode} = task
            let score = keys.every(key => styleCode.includes(key) || buyerName.includes(key) || name.includes(key))
            if (score){
                score = 10
            }
            // for (let key of keys){
            //     key = key.trim()
            //     if (styleCode.includes(key)){
            //         score += 100
            //     }
            //     if (buyerName.includes(key)){
            //         score += 10
            //     }
            //     if (name.includes(key)){
            //         score +=1
            //     }
            // }
            return {
                ...task,
                score: score
            }
        })
        const filteredTasks = scoredTasks.filter( task => task.score > 0)
        const sortedTasks = filteredTasks.sort((a, b) => b.score - a.score)
        return sortedTasks;
    }

    const onSelect = (value) => {
        console.log('onSelect', value);
        setResults(filterTasks(value))
    };

    const updateSearchQuery = (query) => {
        const params = new URLSearchParams()
        if (query) {
          params.append("q", query)
        } else {
          params.delete("q")
        }
        history.push({search: params.toString()})
     }

    return (
        <div style = {{
            paddingLeft:'6px',
            paddingRight:'6px'
        }}>
        {showLoader && <Loader/>}
        <div>
           <Input.Search size="large" allowClear value={new URLSearchParams(search).get("q")} placeholder="Search Tasks" enterButton onChange={(e)=>
           {
                console.log("Search",e.target.value)
                updateSearchQuery(e.target.value)
                onSelect(e.target.value)
            }} />
        </div>
        {/* {tasks.length === 0 && !showLoader ? <Empty description="No Task For Today"/>: <Title style ={{width:'100%', textAlign:'center'}}align="middle" level={4}>Daily Tasks</Title>} */}
            {results.map((task) => <ZenlorCard key = {task.styleCode+task.id} description={task.name} onClick = { () => {
                onTaskClick(task.styleCodeId, task.id)
            }} {...task}/> )}
        </div>
    )
}

export default Tasks;