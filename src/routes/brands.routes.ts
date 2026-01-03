import express from 'express';
import { addBrandController, getAllBrandController } from '../services/brands/brands.controller';

const router = express.Router();

router.get('/', getAllBrandController);
router.post('/create', addBrandController)

export default router;
