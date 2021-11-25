import { FETCH_DATA, UPDATE_AUTH} from "./actionType"
export const fetchDataAction = (data) => ({
    type: FETCH_DATA,
    payload: {...data}
})
export const updateAuth = (user) => ({
    type: UPDATE_AUTH,
    payload: {user}
})