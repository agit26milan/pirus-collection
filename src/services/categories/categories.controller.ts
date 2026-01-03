import { Request, Response } from "express";
import db from "../../config/db";
import { handleGlobalResponse } from "../../utils/response";
import { convertColumnValue } from "../../utils/converter";
export const getAllCategories = (req: Request, res: Response) => {
  db.query("SELECT * FROM categories", (error, result) => {
    if (error) return res.status(500).json(error);
    res
      .status(200)
      .json(handleGlobalResponse(200, result, "Success get category"));
  });
};


export const addCategoryController = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name)
    return res
      .status(400)
      .json(handleGlobalResponse(400, null, "name cannot be empty"));
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => "?").join(", ");
  const sql = `
        INSERT INTO categories (${columns.join(", ")})
        VALUES (${placeholders})
    `;
  try {
    await db.execute(sql, values);
    res.json({
      message: "Kategory berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};