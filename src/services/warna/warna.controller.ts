import { Request, Response } from "express";
import db from "../../config/db";
import { handleGlobalResponse } from "../../utils/response";
import { convertColumnValue } from "../../utils/converter";
export const getAllColor = (req: Request, res: Response) => {
  db.query("SELECT * FROM warna", (error, result) => {
    if (error) return res.status(500).json(error);
    res
      .status(200)
      .json(handleGlobalResponse(200, result, "Success get warna"));
  });
};

export const addColorController = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.image)
    return res
      .status(400)
      .json(handleGlobalResponse(400, {}, "name and image cannot be empty"));
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `
        INSERT INTO warna (${columns.join(", ")})
        VALUES (${placeholders})
    `;
  try {
    await db.execute(sql, values);
    res.json({
      message: "Produk berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const editColorController = async (req: Request, res: Response) => {
  let data = req.body;
  const params = req.params;
  const date = new Date();
  data = { ...data, updated_at: date };
const {columns, values} = convertColumnValue(data)
  const sql = `UPDATE warna SET ${columns.map((col) => `${col} = ?`).join(", ")}
    WHERE id = ?`;
  try {
    await db.execute(sql, [...values, params.id]);
    res.status(200).json(handleGlobalResponse(200, {}, "Success edit color"));
  } catch (e) {
    res.status(500).json(handleGlobalResponse(500, {}, "Failed update color"));
  }
};

export const removeColorController = async (req: Request, res: Response) => {
  const params = req.params;
  const sql = `DELETE FROM warna WHERE id = ?`;
  try {
    await db.execute(sql, [params.id]);
    res.status(200).json(handleGlobalResponse(200, {}, "Success delete color"));
  } catch (e) {
    res.status(400).json(handleGlobalResponse(200, {}, String(e)));
  }
};
