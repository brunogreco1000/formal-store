// src/controllers/cartController.ts

import type { Request, Response } from 'express'; 
import asyncHandler from 'express-async-handler';
// 🔑 Importaciones de Modelos/Tipos Corregidas
import Cart from '../models/Cart.ts'; 
import type { ICart } from '../models/Cart.ts';
import Product from '../models/Product.ts';
import type { IProduct } from '../models/Product.ts';

// GET /api/cart
// 🔑 CORRECCIÓN: Usar 'export const'
export const getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        res.status(401);
        throw new Error('Usuario no autenticado.');
    }

    // Buscar ítems y popular el detalle del producto (solo campos relevantes)
    const cartItems = await Cart.find({ userId: userId })
        .populate<{ productId: IProduct }>('productId', 'name price image');
    
    res.json({ items: cartItems });
});

// POST /api/cart
// 🔑 CORRECCIÓN: Usar 'export const'
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { productId, quantity: requestedQuantity } = req.body;
    const userId = req.user?._id || req.user?.id;
    const quantity = parseInt(requestedQuantity as string, 10) || 1;

    if (!userId) {
        res.status(401);
        throw new Error('Usuario no autenticado.');
    }
    
    // 1. Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Producto no encontrado.');
    }

    // 2. Verificar si el ítem ya está en el carrito
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
        // Si existe, actualiza la cantidad
        cartItem.quantity += quantity;
        await cartItem.save();
    } else {
        // Si no existe, crea un nuevo ítem
        cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.status(cartItem ? 200 : 201).json({ 
        message: 'Producto añadido/actualizado en el carrito.', 
        item: cartItem 
    });
});

// PUT /api/cart/:id
// 🔑 CORRECCIÓN: Usar 'export const' y lógica de actualización por PUT/PATCH
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const cartItemId = req.params.id;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        res.status(401);
        throw new Error('Usuario no autenticado.');
    }
    if (quantity === undefined || typeof quantity !== 'number' || quantity < 1) {
        res.status(400); // Bad Request
        throw new Error('La cantidad debe ser un número positivo.');
    }

    // Buscar y actualizar el ítem por ID y asegurar que pertenece al usuario
    const cartItem = await Cart.findOneAndUpdate(
        { _id: cartItemId, userId: userId },
        { quantity: quantity },
        { new: true }
    );

    if (!cartItem) {
        res.status(404);
        throw new Error('Ítem del carrito no encontrado o no pertenece al usuario.');
    }

    res.json({ 
        message: 'Cantidad actualizada correctamente.', 
        item: cartItem 
    });
});

// DELETE /api/cart/:id
// 🔑 CORRECCIÓN: Usar 'export const'
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const cartItemId = req.params.id;
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
        res.status(401);
        throw new Error('Usuario no autenticado.');
    }

    // Eliminar el ítem y asegurar que pertenece al usuario
    const result = await Cart.deleteOne({ _id: cartItemId, userId: userId });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Ítem del carrito no encontrado o no pertenece al usuario.');
    }

    res.status(200).json({ message: 'Ítem eliminado del carrito.' });
});