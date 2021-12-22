import { FETCH_DATA, UPDATE_AUTH, UPDATE_ROLE, UPDATE_STYLE_CODE_INFO} from "./actionType"
export const fetchDataAction = (data) => ({
    type: FETCH_DATA,
    payload: {...data}
})
export const updateAuth = (user) => ({
    type: UPDATE_AUTH,
    payload: {user}
})
export const udpateRole = (role, company) => ({
    type: UPDATE_ROLE,
    payload: {role, company}
})
export const updateStyleCodeInfo = (styleCodeInfo) => ({
    type: UPDATE_STYLE_CODE_INFO,
    payload: {
        styleCodeInfo
    }
})