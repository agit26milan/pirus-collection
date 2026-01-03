export const handleGlobalResponse = (status: number, data: any, message:string) => {
    return {
        status,
        data, 
        message
    }
}