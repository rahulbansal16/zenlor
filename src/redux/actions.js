import { FETCH_DATA, FETCH_PO, FETCH_PURCHASE_MATERIALS_INFO, INSERT_ROW, UPDATE_AUTH, UPDATE_CELL, UPDATE_ROLE, UPDATE_STYLE_CODE_INFO} from "./actionType"
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
export const fetchPOs = (pos) => ({
    type: FETCH_PO,
    payload: {
        data: pos
    }
})
export const fetchPurchaseMaterialsInfo = (purchaseMaterials) =>({
    type: FETCH_PURCHASE_MATERIALS_INFO,
    payload: {
        data: purchaseMaterials
    }
})

export const updateCell = (row, type) => ({
    type: UPDATE_CELL,
    payload: {
        row,
        type
    }
})

export const insertRow = (row, type) => ({
    type: INSERT_ROW,
    payload: {
        row,
        type
    }
})