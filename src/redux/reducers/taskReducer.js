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
    isFetching: true,
    name:  "Factory",
    form: [{
        "name": "cutting",
        "lines":[1],
        "process":["fabric issued", "output"],
        "form": {
            "fabric issued": [
                {
                    "label":"Enter Fabric Issued Quantity",
                    "field":"fabricIssued"
                }
            ],
            "output": [
                {
                    "label":"Enter Cutting Done Quantity",
                    "field": "output"
                }
            ]
        }
    },{
        "name": "sewing",
        "lines": [1, 2, 3],
        "process":["loading", "output"],
        "form": {
            "loading": [
                {
                    "label": "Enter Loading Received Quantity",
                    "field": "loadingReceivedQuantity"
                }
            ],
            "output": [
                {
                    "label":"Enter Sewing Done Quantity",
                    "field": "output"
                }
            ]
        }
    },{
        "name": "kajjaandbuttoning",
        "lines": [1],
        "process": ["received from sewing", "output"],
        "form": {
            "received from sewing": [
                {
                    "label": "Enter Sewing Received Quantity",
                    "field":"sewingReceivedQuantity"
                }
            ],
            "output": [
                {
                    "label": "Enter Kaja & Buttoning Done Quantity",
                    "field":"output"
                }
            ]
        }
    },{
        "name": "washing",
        "lines": [1],
        "process": ["sending", "receiving"],
        "form": {
            "sending": [
                {
                    "label": "Enter Washing Sent Quantity",
                    "field": "washingSentQuantity"
                }
            ],
            "receiving": [
                {
                    "label": "Enter Washing Received Quantity",
                    "field": "washingReceivedQuantity"
                }
            ]
        }
    },{
        "name": "packing",
        "lines": [1],
        "process": ["received from washing", "pre inspection"],
        "form": {
            "received from washing" : [{
                "label": "Enter Washing Received Quantity",
                "field": "washingReceivedQuantity"
            }],
            "pre inspection": [{
                "label": "Enter Packed Quantity",
                "field": "packedQuantity"
            }, {
                "label": "Enter Rejected Quantity",
                "field":"rejectedQuantity"
            }]
        }

    }]
}

const taskReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_DATA: {
            const {cutting, styleCodes, washing, sewing, kajjaandbuttoning, packing, isFetching, departments, name, form} = action.payload
            return {
                ...state,
                departments,
                cutting: [...cutting],
                washing: [...washing],
                styleCodes: [...styleCodes],
                sewing: [...sewing],
                kajjaandbuttoning: [...kajjaandbuttoning],
                packing: [...packing],
                isFetching,
                name,
                form: form  || state.form
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
            const {role, company} = action.payload
            const user = JSON.parse(JSON.stringify(state.user))
            user["role"] = role
            user["company"] = company
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