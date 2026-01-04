import { Request, Response } from "express"
import db from "../../config/db"
import { handleGlobalResponse } from "../../utils/response"
import { addProductService, editProductService, getProductService } from "./products.service"
export const getAllProduct = async (req: Request, res: Response) => {
   try {
      const response = await getProductService(req.query)
      res.status(200).json(handleGlobalResponse(200, response.data, 'Success get data'))
   }catch(e) {
      res.status(500).json(handleGlobalResponse(500, null, 'Failed get data'))
   }
}

export const addProductController = async (req: Request, res: Response) => {
   try {
      const {brand_id, warna_id, name, deskripsi, category_id} = req.body
      if(!brand_id || !warna_id || !category_id) return res.status(400).json(handleGlobalResponse(400, null, 'brandId, warnaId, category_id is required'))
      const response = await addProductService({brand_id, warna_id, deskripsi, category_id})
      res.status(200).json(response)
   }catch(e) {
       res.status(500).json(handleGlobalResponse(500, null, 'Failed create product'))
   }
}

export const editProductController = async (req: Request, res: Response) => {
   try {
      const {id} = req.params
      const {brand_id, warna_id, deskripsi, category_id} = req.body
      const response = await editProductService(Number(id), {brand_id, warna_id, deskripsi,category_id})
      res.status(200).json(response)
   }catch(e) {
       res.status(500).json(handleGlobalResponse(500, null, 'Failed create product'))
   }
}

export const getProductDetailController = (req:Request, res: Response) => {
   const sql = `SELECT * FROM produk WHERE id = ${req.params.id}`
   db.query(sql, (error, result:any) => {
      if(error) return res.status(400).json(handleGlobalResponse(400, null, 'Cannot get detail produk'))
      if(result.length <= 0) return res.status(400).json(handleGlobalResponse(400, null, 'Cannot get product detail'))
      res.status(200).json(handleGlobalResponse(200, result[0] || {}, 'Success get detail product'))
   })
}