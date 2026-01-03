import express from 'express';
import {getAllProduct} from '../services/products/products.controller'

const router = express.Router();

router.get('/', getAllProduct);

export default router;
