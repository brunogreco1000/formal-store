import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.ts';
import Order from '../models/Order.ts';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

const createOrder = async (req: express.Request, res: express.Response) => {
    const { userId, items, total, shippingInfo, paymentMethod } = req.body;

    if (!userId || !items || items.length === 0 || !total) {
        return res.status(400).json({ message: "Datos de orden incompletos o inválidos." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const orderItems = items.map((item: CartItem) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        }));

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount: total,
            shippingInfo,
            paymentMethod,
            status: 'Pending'
        });

        await newOrder.save({ session });

        const itemIdsToDelete = items.map((item: CartItem) => item.id);

        const deleteResult = await Cart.deleteMany({
            _id: { $in: itemIdsToDelete },
            userId: userId
        }, { session });

        if (deleteResult.deletedCount !== itemIdsToDelete.length) {
            throw new Error("Error de consistencia: No se pudo limpiar el carrito completamente.");
        }

        await session.commitTransaction();

        res.status(201).json({ 
            message: "Orden creada exitosamente y carrito actualizado.",
            order: newOrder
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error de servidor desconocido.";
        await session.abortTransaction();
        console.error("Error al procesar la orden:", error);
        res.status(500).json({ 
            message: "Fallo al procesar la orden. La transacción fue abortada.", 
            error: errorMessage 
        });
    } finally {
        session.endSession();
    }
};

export default createOrder;
