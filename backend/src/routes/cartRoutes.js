import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas requieren estar logueado
router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.patch('/:id', authMiddleware, updateCartItem);
router.delete('/:id', authMiddleware, removeFromCart);

export default router;
