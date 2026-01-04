import express from 'express';
import { addStockController, getStockController} from '../services/stock/stock.controller';

const router = express.Router();

router.get('/', getStockController);
router.post('/create', addStockController)


export default router;
