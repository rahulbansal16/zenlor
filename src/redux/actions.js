import { FETCH_DATA, UPDATE_AUTH, UPDATE_ROLE} from "./actionType"
export const fetchDataAction = (data) => ({
    type: FETCH_DATA,
    payload: {...data}
})
export const updateAuth = (user) => ({
    type: UPDATE_AUTH,
    payload: {user}
})
export const udpateRole = (role) => ({
    type: UPDATE_ROLE,
    payload: {role}
})