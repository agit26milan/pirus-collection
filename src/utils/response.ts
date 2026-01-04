export const handleGlobalResponse = (status: number, data: any, message:string) => {
    return {
        status,
        data, 
        message,
        success: status >= 200 && status < 300 ? true : false
    }
}