// Filter could be sorting , string or number 
// Multiselect
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
    const result = filters.filter(item => {
        // console.log("The item value is", item.value)
        if(!hash[item.value]){
            hash[item.value] = true
            return true
        }
        return false
    });
    // console.log("The final result is", result)
    return result
}

const useFilter = (columns, dataSource) => {
    const columnsWithFilter = columns.map( column => {
        if (!column.filter)
            return column;
        let filterColumn = {
            ...column,
            sorter: (a,b) => a[column?.dataIndex] - b[column?.dataIndex]
        }
        const {filter, dataIndex} = column
        switch(filter){
            case "multiSelect":
                filterColumn["onFilter"] = (value, record) => {
                    console.log("In the onFilter Method", value, record, record);
                    return record[column?.dataIndex] === value }
                filterColumn['filters'] = fetchAllKeys(dataSource, dataIndex)
                break;
            default:
                break
        }
        return filterColumn
    })
    return columnsWithFilter
}
export default useFilter;