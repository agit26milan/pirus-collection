import { Request, Response } from "express";
import db from "../../config/db";
import { handleGlobalResponse } from "../../utils/response";
import { validationData } from "../../utils/validation";
import { addStockService } from "./stock.service";

export const getStockController = (req: Request, res: Response) => {
  db.query("SELECT * FROM stok_masuk", (err, result) => {
    if (err)
      return res
        .status(500)
        .json(handleGlobalResponse(500, null, "Error get list stock"));
    res
      .status(200)
      .json(handleGlobalResponse(200, result, "Success get list stock"));
  });
};

export const addStockController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const requiredData = ["produk_id", "qty", "harga_beli"];
    const { isNotValid, emptyState } = validationData(body, requiredData);
    if (isNotValid)
      return res
        .status(400)
        .json(
          handleGlobalResponse(
            400,
            null,
            `${emptyState.join(",")} cannot be empty`
          )
        );
    const response = await addStockService(body);
    res
      .status(200)
      .json(handleGlobalResponse(200, null, "Success create stock"));
    console.log(isNotValid, "manak");
  } catch (e) {
    res
      .status(500)
      .json(handleGlobalResponse(500, null, "failed create stock"));
  }
};
