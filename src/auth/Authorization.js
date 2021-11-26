import { useEffect, useReducer, useState } from "react"
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { auth } from "../firebase";

/**
 * roles = [{name: admin, department: all}, {name:'manager', department:'cutting'}]
 */
const userAuthorised = (allowedRoles, roles, departmentName) => {
    for (let role of roles){
        if (allowedRoles.includes(role.name)){
            if ( role.department === "all" || departmentName === role.department){
                return true
            }
        }
    }
    return false
}

const Authorization = ({allowedRoles, department, children}) => {

    const user = useSelector(state => state.taskReducer.user)
    console.log("Rendering the user ", user.role, user.rolesFetched)

    if (!user["rolesFetched"])    
        return <Loader/>

    if (userAuthorised(allowedRoles, user["role"] || []  ,department )){
        return children
    }

    return "Please Contact Your Manager"

}

export default Authorization;