export const validationData = (object:any, requiredData:any[]) => {
    let notValidData:any[] = []
    requiredData.forEach((data) => {
        if(object[data] === null || object[data] === undefined) {
            notValidData.push(data)
        }
    })
    return {
        isNotValid: notValidData.length > 0,
        emptyState: notValidData
    }
}