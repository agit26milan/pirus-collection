import express from 'express';
import {addProductController, editProductController, getAllProduct, getProductDetailController} from '../services/products/products.controller'

const router = express.Router();

router.get('/', getAllProduct);
router.get('/:id', getProductDetailController)
router.post('/create', addProductController)
router.put('/edit/:id', editProductController)

export default router;
