import express from 'express';
import { addCategoryController, getAllCategories } from '../services/categories/categories.controller';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/create', addCategoryController)


export default router;
