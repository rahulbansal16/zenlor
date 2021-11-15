import { Empty } from "antd"
import { useSelector } from "react-redux"
import { useLocation } from "react-router"
import PlusButton from "../components/PlusButton"
import UpdateCard from "./UpdateCard"

const filterData = (state, department, lineNumber)  => {
    const departmentData = state.taskReducer[department] || []
    if (lineNumber){
        return departmentData.filter( data => data.lineNumber === lineNumber)
    }
    return departmentData
}

const Home = ({department}) => {

    const search = useLocation().search
    const lineNumber = new URLSearchParams(search).get("lineNumber");

    console.log("The department is", department)
    const updates = useSelector( state => filterData(state, department, lineNumber))
    console.log("The updates are", updates)

    return (
        <div>
            {department.toUpperCase()}
            {updates.map( ({styleCode, styleCodeId})  => <UpdateCard styleCode={styleCode} styleCodeId = {styleCodeId}/>)}
            {updates.length === 0 && <Empty/>}
            <PlusButton url = {`/${department}/process/form`}/>
        </div>
    )
}

export default Home