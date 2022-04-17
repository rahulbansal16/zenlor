import moment = require("moment");
import { Constants } from "./Constants";


export const generateKey = (materialId: string, materialDescription: string): string=> {
    return materialId +"|"+materialDescription
}

export const parseIdAndDescription = (key:string):{ materialId: string, materialDescription: string} => {
    let [materialId, materialDescription] = key.split(":");
    materialId = materialId.substring(1)
    return {
        materialId,
        materialDescription
    }
}

export const getDateFormat = (date: string) => {
    return moment(date, Constants.DATE_FORMAT).format(Constants.DATE_FORMAT)
//    return moment(date).format("MMM ")
}

export const getCurrentDate = () => {
    return moment().format(Constants.DATE_FORMAT);
}

// export const cmpDate = (date, ) => {

// }