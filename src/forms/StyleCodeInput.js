import {AutoComplete} from "antd"
import { useEffect, useState } from "react";

// StyleCode Name on the Top

const StyleCodeInput = ({styleCodes, onSelectCb}) => {

    const [options, setOptions] = useState([]);
    const [results, setResults] = useState([])

    useEffect( () => {
        let p = [{name:"wksh", id:121}, {name:"xzy", id:345}]
        setResults(p)
    }, [styleCodes])

    const filterOptions = (term) => {

        if (term.length === 0 || term === ""){
            return []
        }
        term = term.trim()
        term = term.toUpperCase()
        const scoredTasks =  results.map(styleCode  => {
            const {id, name} = styleCode
            let score = 0
            if (name.includes(term) || name.includes(term.toLowerCase())){
                score = 1
            }
            return {
                ...styleCode,
                score: score
            }
        })
        const filteredTasks = scoredTasks.filter( task => task.score > 0)
        const sortedTasks = filteredTasks.sort((a, b) => b.score - a.score)
        return sortedTasks;
    }

    const handleSearch = (query) => {
        // const results = tasks.filter(  task => query.split().every() )
        console.log('The search query is ', query)
        console.log("The sortedTasks are", filterOptions(query))
        const filteredResult = filterOptions(query)
        setOptions( filteredResult.map( item => {
            const {id, name} = item
            return {
                    value: name,
                    label:name,
                    text:name
                }
        }) )
    };

    const onSelect = (value) => {
        console.log('onSelect', value);
        onSelectCb(value)
    };
    return <div>
            <AutoComplete
                label="Enter code"
                dropdownMatchSelectWidth={252}
                style={{ width: 300 }}
                options={options}
                placeholder="Enter StyleCode"
                onSelect={onSelect}
                onSearch={handleSearch}
            ></AutoComplete>
    </div>
}
export default StyleCodeInput