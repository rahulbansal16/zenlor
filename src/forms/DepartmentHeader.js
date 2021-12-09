import { useSelector } from "react-redux";

const DepartmentHeader = ({department: departmentId, lineNumber}) => {
    const departmentsData = useSelector( state => state.taskReducer.form)
    const department = departmentsData.filter( department => department.id === departmentId)[0];
    if (!department)
        return <></>
    const {name, lines} = department;
    return (<h2 style={{marginBottom:'8px'}}>
        {name + " " + (lines.length > 1 ? "Line " + lineNumber : "")}
    </h2>)
}

export default DepartmentHeader