

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

