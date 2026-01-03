import db from "../../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { convertColumnValue } from "../../utils/converter";

interface ProductData {
  brand_id: string | number;
  warna_id: string | number;
  name: string;
  deskripsi?: string;
}

export async function addProductService(items: ProductData) {
  try {
    const conn = db.promise();

    await conn.beginTransaction();

    const [brands]: any = await conn.execute(
      "SELECT name FROM brand WHERE id = ?",
      [items.brand_id]
    );
    const brandName = brands[0].name;
    const [color]: any = await conn.execute(
      "SELECT name FROM warna WHERE id = ?",
      [items.warna_id]
    );
    const colorName = color[0].name;
    await conn.execute(
      "INSERT INTO produk (brand_id, warna_id, name, brand_name, color_name, deskripsi) VALUES (?, ?, ?, ?, ?, ?)",
      [
        Number(items.brand_id),
        Number(items.warna_id),
        items.name,
        brandName,
        colorName,
        items.deskripsi || "",
      ]
    );
    await conn.commit();
    return {
      status: 200,
      data: {},
      message: "Success add product",
    };
  } catch (e) {
    return {
      status: 500,
      data: {},
      message: "Failed add product",
    };
  }
}

export async function editProductService(
  idProduct: number,
  items: ProductData
) {
  try {
    const conn = db.promise();

    await conn.beginTransaction();
    let brandName;
    let colorName;
    if (items.brand_id) {
      const [brands]: any = await conn.execute(
        "SELECT name FROM brand WHERE id = ?",
        [items.brand_id]
      );
      brandName = brands?.[0].name;
    }
    if (items.warna_id) {
      const [color]: any = await conn.execute(
        "SELECT name FROM warna WHERE id = ?",
        [items.warna_id]
      );
      colorName = color?.[0].name;
    }

    let body:any = { ...items };
    if(brandName) {
        body = {...body, brand_name: brandName}
    }
    if(colorName) {
        body = {...body, color_name: colorName}
    }
    const { columns, values } = convertColumnValue(body);
    await conn.execute(
      `UPDATE produk SET ${columns
        .map((col) => `${col} = ?`)
        .join(", ")} WHERE id = ?`,
      [...values, idProduct]
    );
    await conn.commit();
    return {
      status: 200,
      data: {},
      message: "Success edit product",
    };
  } catch (e) {
    return {
      status: 500,
      data: null,
      message: "Failed add product",
    };
  }
}
