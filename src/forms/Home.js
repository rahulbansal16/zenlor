import { Empty } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router"
import Loader from "../components/Loader"
import PlusButton from "../components/PlusButton"
import DepartmentHeader from "./DepartmentHeader"
import UpdateCard from "./UpdateCard"

const filterData = (state, department, lineNumber)  => {
    const departmentData = state.taskReducer[department] || []
    if (lineNumber){
        return departmentData.filter( data => data.lineNumber === lineNumber)
    }
    return departmentData
}

const Home = ({department}) => {

    const isFetching = useSelector(state => state.taskReducer.isFetching)
    const search = useLocation().search
    const lineNumber = new URLSearchParams(search).get("lineNumber");

    console.log("The department is", department)
    const updates = useSelector( state => filterData(state, department, lineNumber))
    console.log("The updates are", updates)

    return (
        <div>
            <DepartmentHeader department={department} lineNumber={lineNumber}/>
            {isFetching && <Loader/>}
            <div className="mg-y">
                {!isFetching && updates.map( ({id, styleCode, styleCodeId, process, createdAt, lineNumber, values})  => <UpdateCard key = {id} id={id} styleCode={styleCode} styleCodeId = {styleCodeId} process={process} createdAt={createdAt} data={values} lineNumber={lineNumber}/>)}
            </div>
            {!isFetching && updates.length === 0 && <Empty/>}
            <PlusButton url = {`/${department}/process/form?lineNumber=${lineNumber||1}`}/>
        </div>
    )
}

export default Home