import { useSelector } from "react-redux"
import { useHistory } from "react-router"

const { Button} = require("antd")
const Department = () => {

    const departmentsData = useSelector( state => state.taskReducer.form)
    const history = useHistory()

    let departments = []
    for ( let departmentData of departmentsData){
        const {name, lines, id} = departmentData;
        for ( let line of lines){
            departments.push({
                name: name + ( lines.length > 1 ? " Line " + line : "" ),
                id,
                line
            })
        }
    }
    console.log("The departments are", departments);
    const onClick = (path) => {
        history.push(path)
    }

    return (
        <div className="mg-x-8">
            {departments.map( ({name, id, line}) => <Button size="large" className="wd-100 mg-y" type="primary" onClick = { () => onClick(`/${id}?lineNumber=${line}`)}>{name}</Button>)}
        </div>
    )
}

export default Department;