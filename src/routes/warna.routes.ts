import express from 'express';
import { addColorController, editColorController, getAllColor, removeColorController } from '../services/warna/warna.controller';

const router = express.Router();

router.get('/', getAllColor);
router.post('/create', addColorController)
router.put('/edit/:id', editColorController)
router.delete('/delete/:id', removeColorController)

export default router;
