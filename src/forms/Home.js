import { Button, Empty } from "antd";
import { useState } from "react";

import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import Loader from "../components/Loader";
import PlusButton from "../components/PlusButton";
import DepartmentHeader from "./DepartmentHeader";
import UpdateCard from "./UpdateCard";
import { MenuOutlined } from "@ant-design/icons";
import moment from "moment";
import Header from "../components/Header";

const filterData = (state, department, lineNumber) => {
  let departmentData = state.taskReducer[department] || [];
  departmentData = departmentData.filter(({ status }) => status === "active");
  if (lineNumber) {
    return departmentData.filter((data) => data.lineNumber === lineNumber);
  }
  return departmentData;
};

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

const Home = ({ department }) => {
  const isFetching = useSelector((state) => state.taskReducer.isFetching);
  const search = useLocation().search;
  const lineNumber = new URLSearchParams(search).get("lineNumber");

  console.log("The department is", department);
  const updates = useSelector((state) =>
    filterData(state, department, lineNumber)
  );
  // const total = useSelector((state) => state.taskReducer.aggregate);
  console.log("The updates are", updates);
  const generateKey = (styleCode, department, lineNumber, process) => {
    console.log(styleCode, department, lineNumber, process)
    return `${styleCode.toLowerCase()}-${department.toLowerCase()}-${lineNumber}-${process.toLowerCase()}`;
  };
  let p = updates.sort((a,b)=> -moment(a.createdAt).valueOf() + moment(b.createdAt).valueOf())
  const cumulative = {}
  console.log("The p is", p);
  for (let i = p.length-1; i >= 0; i -= 1){
    let update = p[i]
    console.log("The udpate is", update);
    const { styleCode, department, lineNumber, process, values} = update;
    console.log("The updates are ", update);
    const key = generateKey(styleCode, department||"", lineNumber, process);
    const pastValues = cumulative[key];
    if (!pastValues){
      p[i].cumulative = values;
    } else {
      let newValues = {...pastValues};
      for (let key in values){
        newValues[key] = (newValues[key] || 0) +  values[key]
      }
      p[i].cumulative = newValues;
    }
    cumulative[key] = p[i].cumulative;
  }
  console.log("The cumulative is", cumulative);

  console.log("The p and updaes are",p, updates)
  return (
    <div>
      <Header/>
      <DepartmentHeader department={department} lineNumber={lineNumber} />
      {isFetching && <Loader />}
      <div className="mg-y" style={{paddingBottom:"20px"}}>
        {!isFetching &&
      p.map(
            ({
              id,
              styleCode,
              styleCodeId,
              process,
              createdAt,
              enteredAt,
              lineNumber,
              cumulative,
              values,
            }) => (
              <UpdateCard
                key={id}
                id={id}
                styleCode={styleCode}
                styleCodeId={styleCodeId}
                process={process}
                createdAt={createdAt}
                enteredAt={enteredAt}
                data={values}
                total={cumulative}
                lineNumber={lineNumber}
              />
            )
          )}
      </div>
      {!isFetching && updates.length === 0 && <Empty />}
      <DepartmentMenuButton />
      <PlusButton
        url={`/${department}/process/form?lineNumber=${lineNumber || 1}`}
      />
    </div>
  );
};

export default Home;
