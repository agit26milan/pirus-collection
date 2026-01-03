import express from 'express';
import { addBrandController, editBrandController, getAllBrandController, removeBrandController } from '../services/brands/brands.controller';

const router = express.Router();

router.get('/', getAllBrandController);
router.post('/create', addBrandController)
router.put('/edit/:id', editBrandController)
router.delete('/delete/:id', removeBrandController)


export default router;
