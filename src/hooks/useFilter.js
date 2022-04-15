// Filter could be sorting , string or number 
// Multiselect

import { useEffect, useState } from "react";
import ZenlorTags from "../components/ZenlorTags";

// 
const fetchAllKeys = (dataSource, column) => {
    const filters = dataSource.map( item => {
        // console.log("The item is", item, item[column])        
        return {
            text: item[column],
            value: item[column],
        }
    })
    // console.log("The filters", filters)
    const hash = {}
    let result = filters.filter(item => {
        // console.log("The item value is", item.value)
        if(!hash[item.value]){
            hash[item.value] = true
            return true
        }
        return false
    });

    if (result && result.length !== 0 && result[0].value && result[0].value.localeCompare && typeof result[0].value === "string" && typeof result[0].value.localeCompare === "function") 
        result.sort((a,b) => {
            if (typeof a.value === "string")
                return a?.value?.localeCompare(b?.value)
            return a.value - b.value
        
        })

    return result
}

const useFilter = (columns, dataSource) => {
    const [columnsWithFilter, setColumnsWithFilter] = useState()
    useEffect(() => {
        if (!columns || !dataSource) 
        return []
       const columnsWithFilterResult = columns.map( column => {
        let filterColumn = {
            ...column,
         //    sorter: (a,b) => a[column?.dataIndex] - b[column?.dataIndex]
        }

        if(column.dataIndex && column.dataIndex.includes("Url")){
            filterColumn.render = (text) => <a href={text}>Download</a>
        }
        
        if (column.dataIndex && column.dataIndex.includes("materialStatus")){
            filterColumn.render =  (data) => <ZenlorTags text={data}/>
        }

           if (!column.filter)
               return filterColumn;
           const {filter, dataIndex} = column
           switch(filter){
               case "multiSelect":
                   filterColumn["onFilter"] = (value, record) => {
                       console.log("In the onFilter Method", value, record, record);
                       return record[column?.dataIndex] === value }
                   filterColumn['filters'] = fetchAllKeys(dataSource, dataIndex)
                   // console.log("The filterColumn Key is", filterColumn.key)
                   filterColumn.filteredValue = null;
                   // console.log("The filterColumn", filterColumn.filteredValue)
                   break;
               default:
                   break
           }
           return filterColumn
       })
       setColumnsWithFilter(columnsWithFilterResult)
    //    return columnsWithFilter
    }, [columns, dataSource])
    return columnsWithFilter
}
export default useFilter;