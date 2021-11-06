import { FETCH_COMPLETE_TASKS, FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS } from "../actionType";

const initialState = {
    inCompleteTasks: [],
    completeTasks: []
}

const taskReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_TASK_STATUS:{
            const {styleCodeId, taskId, status} = action.payload
            if (status === "incomplete"){
                return state
            }
            return {
                ...state,
                inCompleteTasks: state.inCompleteTasks.filter((task) => {
                    if ( styleCodeId === task.styleCodeId && taskId === task.id) return false
                    return true
                }),
            }
        }
        case FETCH_INCOMPLETE_TASKS:{
            const {tasks} = action.payload
            return {
                ...state,
                inCompleteTasks: tasks
            }
        }
        case FETCH_COMPLETE_TASKS: {
            const {tasks} = action.payload
            return {
                ...state,
                completeTasks: tasks
            }
        }
        default:
            return state
    }
 }

 export default taskReducer