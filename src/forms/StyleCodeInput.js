import {AutoComplete, Select} from "antd"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AutoCompleteSelector from "./AutoCompleteSelector";

// StyleCode Name on the Top

const StyleCodeInput = ({onSelectCb}) => {

    const styleCodes = useSelector( state => state.taskReducer.styleCodes)
    // const styleCodesInfo = useSelector( state => state.taskReducer.styleCodesInfo)
    // const mapedStyleCodesInfo = styleCodesInfo.map( styleCode => ({
    //     id: styleCode.styleCode,
    //     name: styleCode.styleCode
    // }));
    // const filteredStyleCodes = [...styleCodes, ...mapedStyleCodesInfo]
    return <AutoCompleteSelector label={"Enter code"} onSelectCb={onSelectCb} data={styleCodes}/>

    const [options, setOptions] = useState([]);

    useEffect( () => {
        // console.log("The result is")
        setOptions(styleCodes.map( item => {
            const {id, name} = item
            return {
                    value: name,
                    label:name,
                    text:name
                }
        } ))
    }, [styleCodes])
    // const [results, setResults] = useState([])

    // useEffect( () => {
    //     let p = [{name:"wksh", id:121}, {name:"xzy", id:345}]
    //     setResults(p)
    //     handleSearch(" ")
    // }, [styleCodes])

    const filterOptions = (term) => {

        // if (term.length === 0 || term === ""){
        //     return []
        // }
        term = term.trim()
        term = term.toUpperCase()
        const scoredTasks =  styleCodes.map(styleCode  => {
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
            <Select
                showSearch
                label="Enter code"
                dropdownMatchSelectWidth={252}
                style={{ width: 300 }}
                options={options}
                placeholder="Start Typing"
                onSelect={onSelect}
                onSearch={handleSearch}
            ></Select>
    </div>
}
export default StyleCodeInput