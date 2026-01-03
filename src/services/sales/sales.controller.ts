import { Request, Response } from 'express';
import { prosesPenjualanFIFO } from './sales.services';
export async function jualFIFO(req: Request, res: Response) {
  try {
    const { tanggal, items } = req.body;
    const result = await prosesPenjualanFIFO(tanggal, items);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

