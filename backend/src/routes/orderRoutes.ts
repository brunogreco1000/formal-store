import express from 'express';
import createOrder from '../controllers/orderController.ts';
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/', authMiddleware, createOrder);

export default router;
