import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// 1. Declaración de la interfaz SIN 'export'
interface ICart extends Document {
  _id: Types.ObjectId;        
  userId: Types.ObjectId;    
  productId: Types.ObjectId;  
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema del carrito
const cartSchema: Schema<ICart> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });

// Modelo tipado
const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);

// 2. Exportación del Modelo por defecto
export default Cart;

// 🔑 Solución Probada: Exportar el tipo de forma nombrada al final
export type { ICart };