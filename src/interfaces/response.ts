export interface GlobalResponse<T> {
    success:boolean
    status:number
    data: T
    message: string
}