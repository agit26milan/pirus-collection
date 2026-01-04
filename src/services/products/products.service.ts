import db from "../../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { convertColumnValue } from "../../utils/converter";
import { GlobalResponse } from "../../interfaces/response";

interface ProductData {
  brand_id: string | number;
  warna_id: string | number;
  deskripsi?: string;
  category_id: number;
}

interface ProductFilter {
  search?: string;
  brand_id?: string;
  warna_id?: string;
  category_id?: string;
}

interface IProductData {
  id: string;
  brand_id: number;
  warna_id: number;
  deskripsi: string;
  brand_name: string;
  color_name: string;
  name: string;
  category_name: string;
  category_id: number;
}

export const addProductService = async (
  items: ProductData
): Promise<GlobalResponse<any>> => {
  try {
    const conn = db.promise();

    await conn.beginTransaction();
    const [duplicate]: any = await conn.execute(
      "SELECT name FROM produk WHERE category_id = ? AND brand_id = ? AND warna_id = ?",
      [items.category_id, items.brand_id, items.warna_id]
    );
    if (duplicate.length > 0) {
      return {
        status: 400,
        message: "Duplicate data",
        success: false,
        data: null,
      };
    }
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
    const [category]: any = await conn.execute(
      "SELECT name from categories WHERE id = ?",
      [items.category_id]
    );
    const categoryName = category[0].name;
    const name = `${categoryName} - ${brandName} - ${colorName}`;
    await conn.execute(
      "INSERT INTO produk (brand_id, warna_id, name, brand_name, color_name, deskripsi, category_id, category_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        Number(items.brand_id),
        Number(items.warna_id),
        name,
        brandName,
        colorName,
        items.deskripsi || "",
        items.category_id,
        categoryName,
      ]
    );
    await conn.commit();
    return {
      status: 200,
      data: {},
      message: "Success add product",
      success: true,
    };
  } catch (e) {
    return {
      status: 500,
      data: {},
      message: "Failed add product",
      success: false,
    };
  }
};

export const editProductService = async (
  idProduct: number,
  items: ProductData
): Promise<GlobalResponse<any>> => {
  try {
    const conn = db.promise();

    await conn.beginTransaction();
    let brandName;
    let colorName;
    let categoryName;
    if (items.brand_id) {
      const [brands]: any = await conn.execute(
        "SELECT name FROM brand WHERE id = ?",
        [items.brand_id]
      );
      brandName = brands?.[0]?.name;
    }
    if (items.warna_id) {
      const [color]: any = await conn.execute(
        "SELECT name FROM warna WHERE id = ?",
        [items.warna_id]
      );
      colorName = color?.[0]?.name;
    }
    if (items.category_id) {
      const [category]: any = await conn.execute(
        "SELECT name FROM categories WHERE id = ?",
        [items.category_id]
      );
      categoryName = category?.[0]?.name;
    }

    let body: any = { ...items };
    if (brandName) {
      body = { ...body, brand_name: brandName };
    }
    if (colorName) {
      body = { ...body, color_name: colorName };
    }
    if (categoryName) {
      body = { ...body, category_name: categoryName };
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
      success: true,
    };
  } catch (e) {
    return {
      status: 500,
      data: null,
      message: "Failed add product",
      success: false,
    };
  }
};

export const getProductService = async (
  params: ProductFilter
): Promise<GlobalResponse<any>> => {
  try {
    const conn = db.promise();
    const search = params.search || "";
    const brand_id = params.brand_id || null;
    const warna_id = params.warna_id || null;
    const category_id = params.category_id || null;
    await conn.beginTransaction();

    const [response] = await conn.execute(
      `SELECT * FROM produk WHERE (? = '' OR name LIKE CONCAT('%', ?, '%'))
     AND (? IS NULL OR brand_id = ?) AND (? IS NULL OR warna_id = ?) AND (? IS NULL OR category_id = ?)`,
      [
        search,
        search,
        brand_id,
        brand_id,
        warna_id,
        warna_id,
        category_id,
        category_id,
      ]
    );
    await conn.commit();
    return {
      status: 200,
      data: response || [],
      message: "Success search product",
      success: true,
    };
  } catch (e) {
    return {
      status: 500,
      data: null,
      message: String(e),
      success: false,
    };
  }
};
