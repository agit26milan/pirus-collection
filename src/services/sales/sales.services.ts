import db from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface ItemJual {
  produk_id: number;
  qty: number;
  harga_jual: number;
}

export async function prosesPenjualanFIFO(
  tanggal: string,
  items: ItemJual[]
) {
  const conn = db.promise();

  await conn.beginTransaction();

  try {
    // Insert header penjualan
    const [penjualanResult] = await conn.execute<ResultSetHeader>(
      'INSERT INTO penjualan (tanggal) VALUES (?)',
      [tanggal]
    );

    const penjualanId = penjualanResult.insertId;

    let total = 0;
    let totalKeuntungan = 0;

    for (const item of items) {
      let qtySisaJual = item.qty;

      const [stokList] = await conn.execute<RowDataPacket[]>(
        `SELECT * FROM stok_masuk
         WHERE produk_id = ? AND qty_sisa > 0
         ORDER BY tanggal_masuk ASC`,
        [item.produk_id]
      );

      for (const stok of stokList) {
        if (qtySisaJual <= 0) break;

        const qtyAmbil = Math.min(qtySisaJual, stok.qty_sisa);
        const keuntungan =
          (item.harga_jual - stok.harga_beli) * qtyAmbil;

        // insert detail penjualan
        await conn.execute(
          `INSERT INTO penjualan_detail
           (penjualan_id, produk_id, qty, harga_jual, harga_beli, keuntungan)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            penjualanId,
            item.produk_id,
            qtyAmbil,
            item.harga_jual,
            stok.harga_beli,
            keuntungan
          ]
        );

        // update stok batch
        await conn.execute(
          `UPDATE stok_masuk
           SET qty_sisa = qty_sisa - ?
           WHERE id = ?`,
          [qtyAmbil, stok.id]
        );

        qtySisaJual -= qtyAmbil;
        total += item.harga_jual * qtyAmbil;
        totalKeuntungan += keuntungan;
      }

      if (qtySisaJual > 0) {
        throw new Error('Stok tidak mencukupi');
      }
    }

    // update total penjualan
    await conn.execute(
      `UPDATE penjualan
       SET total = ?, keuntungan = ?
       WHERE id = ?`,
      [total, totalKeuntungan, penjualanId]
    );

    await conn.commit();

    return {
      penjualanId,
      total,
      totalKeuntungan
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  }
}