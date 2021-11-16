const DepartmentHeader = ({department, lineNumber}) => {
    return (<h2 style={{marginBottom:'8px'}}>
        {department.toUpperCase() + " " + (lineNumber ? "Line " + lineNumber : "")}
    </h2>)
}

export default DepartmentHeader