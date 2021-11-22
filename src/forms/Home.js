import { Button, Empty } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router"
import Loader from "../components/Loader"
import PlusButton from "../components/PlusButton"
import DepartmentHeader from "./DepartmentHeader"
import UpdateCard from "./UpdateCard"
import {MenuOutlined } from '@ant-design/icons';


const filterData = (state, department, lineNumber)  => {
    let departmentData = state.taskReducer[department] || []
    departmentData = departmentData.filter( ({status}) => status === "active")
    if (lineNumber){
        return departmentData.filter( data => data.lineNumber === lineNumber)
    }
    return departmentData
}

const DepartmentMenuButton = () => {
  const history = useHistory();

  return (
    <Button
      type="primary"
      size="large"
      onClick={() => history.push("/")}
      style={{
        width: "100%",
        position: "fixed",
        bottom: "0px",
        left: "0px",
      }}
      icon={<MenuOutlined />}
    >
      Dept Menu
    </Button>
  );
};


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
            <DepartmentMenuButton/>
            <PlusButton url = {`/${department}/process/form?lineNumber=${lineNumber||1}`}/>
        </div>
    )
}

export default Home