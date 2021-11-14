import { FETCH_DATA} from "./actionType"
export const fetchDataAction = (data) => ({
    type: FETCH_DATA,
    payload: {...data}
})