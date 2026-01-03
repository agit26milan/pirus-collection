import { Request, Response } from "express"
import db from "../../config/db"
import { handleGlobalResponse } from "../../utils/response"
import { addProductService, editProductService } from "./products.service"
export const getAllProduct = async (req: Request, res: Response) => {
   db.query('SELECT * FROM produk', (error, result) => {
    if(error) return res.status(500).json(error)
      res.status(200).json(handleGlobalResponse(200, result, 'Success get product'))
   })
}

export const addProductController = async (req: Request, res: Response) => {
   try {
      const {brand_id, warna_id, name, deskripsi} = req.body
      if(!brand_id || !warna_id || !name) return res.status(400).json(handleGlobalResponse(400, null, 'brandId, warnaId and name is required'))
      const response = await addProductService({brand_id, warna_id, name, deskripsi})
      res.status(200).json(response)
   }catch(e) {
       res.status(500).json(handleGlobalResponse(500, null, 'Failed create product'))
   }
}

export const editProductController = async (req: Request, res: Response) => {
   try {
      const {id} = req.params
      const {brand_id, warna_id, name, deskripsi} = req.body
      const response = await editProductService(Number(id), {brand_id, warna_id, name, deskripsi})
      res.status(200).json(response)
   }catch(e) {
       res.status(500).json(handleGlobalResponse(500, null, 'Failed create product'))
   }
}