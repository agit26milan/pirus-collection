import { Request, Response } from "express"
import db from "../../config/db"
import { handleGlobalResponse } from "../../utils/response"
export const getAllProduct = async (req: Request, res: Response) => {
   db.query('SELECT * FROM produk', (error, result) => {
    if(error) return res.status(500).json(error)
      res.status(200).json(handleGlobalResponse(200, result, 'Success get product'))
   })
}