// src/routes/cartRoutes.ts

import express from 'express';
import { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart 
} from '../controllers/cartController.ts';

// ✅ CORRECCIÓN FINAL: Importar 'protect' como exportación por defecto (SIN LLAVES)
import protect from '../middleware/authMiddleware.ts'; 

const router = express.Router();

// Aplica el middleware a todas las rutas del carrito
router.use(protect); 

router.get('/', getCart);
router.post('/', addToCart);

// Usamos PUT para actualizar la cantidad (solución a los problemas de 404 anteriores)
router.put('/:id', updateCartItem); 

router.delete('/:id', removeFromCart);

export default router;