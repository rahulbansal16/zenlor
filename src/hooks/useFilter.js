// Filter could be sorting , string or number 
// Multiselect
// 
const useFilter = (columns) => {
    const columnsWithFilter = columns.map( column => {
        let filterColumn = {
            ...column,
            sorter: (a,b) => a[column?.dataIndex] - b[column?.dataIndex]
        }
        const {filter} = column
        switch(filter){
            case "multiSelect":
                filterColumn["onFilter"] = (value, record) => {
                    console.log("In the onFilter Method", value, record, record);
                    return record[column?.dataIndex] === value }
                break;
            default:
                break
        }
        return filterColumn
    })
    return columnsWithFilter
}
export default useFilter;