// import { FETCH_COMPLETE_TASKS, FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS } from "../actionType";

import { FETCH_DATA, UPDATE_AUTH, UPDATE_ROLE } from "../actionType"

const initialState = {
    user: {
        rolesFetched: false
    },
    departments:[],
    cutting:[],
    sewing: [],
    packing: [],
    kajjaandbuttoning: [],
    washing: [],
    styleCodes: [],
    isFetching: true
}

const taskReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_DATA: {
            const {cutting, styleCodes, washing, sewing, kajjaandbuttoning, packing, isFetching, departments} = action.payload
            return {
                ...state,
                departments,
                cutting: [...cutting],
                washing: [...washing],
                styleCodes: [...styleCodes],
                sewing: [...sewing],
                kajjaandbuttoning: [...kajjaandbuttoning],
                packing: [...packing],
                isFetching
            }
        }
        case UPDATE_AUTH: {
            const {user} = action.payload
            return {
                ...state,
                user
            }
        }
        case UPDATE_ROLE: {
            const {role} = action.payload
            const user = JSON.parse(JSON.stringify(state.user))
            user["role"] = role
            user["rolesFetched"] = true;
            console.log("The user state is", user)
            return {
                ...state,
                user
            }
        }
        // case UPDATE_TASK_STATUS:{
        //     const {styleCodeId, taskId, status} = action.payload
        //     if (status === "incomplete"){
        //         return state
        //     }
        //     return {
        //         ...state,
        //         inCompleteTasks: state.inCompleteTasks.filter((task) => {
        //             if ( styleCodeId === task.styleCodeId && taskId === task.id) return false
        //             return true
        //         }),
        //     }
        // }
        // case FETCH_INCOMPLETE_TASKS:{
        //     const {tasks} = action.payload
        //     return {
        //         ...state,
        //         inCompleteTasks: tasks
        //     }
        // }
        // case FETCH_COMPLETE_TASKS: {
        //     const {tasks} = action.payload
        //     return {
        //         ...state,
        //         completeTasks: tasks
        //     }
        // }
        default:
            return state
    }
 }

 export default taskReducer