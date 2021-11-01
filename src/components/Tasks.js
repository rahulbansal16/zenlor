import { useEffect, useState } from "react";
import ZenlorCard from "./ZenlorCard";
import Loader from "./Loader";
import { useHistory } from "react-router";
import { Input } from 'antd';
import { AutoComplete } from 'antd';

const Tasks = ({tasks}) => {
    const [results, setResults] = useState(tasks)
    const [showLoader, setShowLoader]  = useState(tasks.length === 0)
    const history = useHistory()
    const [options, setOptions] = useState([]);

     useEffect(() => {
        setResults(tasks)
        setShowLoader(tasks.length === 0)
    }, [tasks])

    const onTaskClick = (styleCodeId, taskCodeId) => {
        if (!styleCodeId || !taskCodeId)
            return

        history.push(`/task/${styleCodeId}/${taskCodeId}`)
    }

    const OptionCard = ({styleCode, buyerName, name}) => {
        return (
            <div>
            <div style = {{display:'flex', justifyContent:'space-between'}}>
                <div>{styleCode}</div>
                <div>{buyerName}</div>
            </div>
                <div>{name}</div>
            </div>
        )
    }

    const filterTasks = (term) => {
        if (term.length === 0 || term === ""){
            setResults(tasks)
            return []
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

    const handleSearch = (value) => {
        // const results = tasks.filter(  task => value.split().every() )
        console.log('The search query is ', value)
        console.log("The sortedTasks are", filterTasks(value))
        const result = filterTasks(value)
        setOptions( result.map( item => {
            const {styleCode, buyerName, name} = item
            return {
                    value: styleCode + " " + buyerName + " " + name,
                    label:(<OptionCard styleCode = {styleCode} buyerName={buyerName} name = {name}/>)
                }
        }) )
    };

    const onSelect = (value) => {
        console.log('onSelect', value);
        setResults(filterTasks(value))
    };

    return (
        <div style = {{
            paddingLeft:'6px',
            paddingRight:'6px'
        }}>
        {showLoader && <Loader/>}
        <div>
        <AutoComplete
         style = {{
             width:'100%'
         }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
        >
           <Input.Search size="large" allowClear placeholder="Search Tasks" enterButton />
        </AutoComplete>
        </div>
        {/* {tasks.length === 0 && !showLoader ? <Empty description="No Task For Today"/>: <Title style ={{width:'100%', textAlign:'center'}}align="middle" level={4}>Daily Tasks</Title>} */}
            {results.map((task) => <ZenlorCard key = {task.styleCode+task.id} description={task.name} onClick = { () => {
                onTaskClick(task.styleCodeId, task.id)
            }} {...task}/> )}
        </div>
    )
}

export default Tasks;