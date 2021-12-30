// Filter could be sorting , string or number 
// Multiselect
// 
const useFilter = (columns) => {
    const columnsWithFilter = columns.map( column => ({
      ...column,
        sorter: (a,b) => a[column?.dataIndex] - b[column?.dataIndex]
    }))
    return columnsWithFilter
}
export default useFilter;