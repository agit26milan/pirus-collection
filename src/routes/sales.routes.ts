import express from 'express';
import { jualFIFO} from '../services/sales/sales.controller';

const router = express.Router();

router.post('/create', jualFIFO);

export default router;
