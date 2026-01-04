import db from "../../config/db";
import { GlobalResponse } from "../../interfaces/response";

export interface IPayloadStock {
  produk_id: string;
  qty: string;
  harga_beli: string;
  description:string;
  
}

export const addStockService = async (
  payload: IPayloadStock
): Promise<GlobalResponse<any>> => {
  try {
    const connection = db.promise();
    await connection.beginTransaction();
    const date = new Date()
    const total_price = Number(payload.qty) * Number(payload.harga_beli)
    const stockInsert = `INSERT INTO stok_masuk (produk_id, harga_beli, qty, created_date, updated_date, description, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const sqlInsert = `INSERT INTO stock_acumulation (product_id, total_stok)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE
total_stok = total_stok + VALUES(total_stok)`;
    await connection.execute(stockInsert, [payload.produk_id, payload.harga_beli, payload.qty, date, date, payload.description, total_price]);
    await connection.execute(sqlInsert, [payload.produk_id, payload.qty]);
    await connection.commit();
    return {
      status: 200,
      success: true,
      message: "Success add stock",
      data: null,
    };
  } catch (e) {
    return {
      status: 400,
      success: false,
      message: "failed add stock",
      data: null,
    };
  }
};
