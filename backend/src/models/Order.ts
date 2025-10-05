import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IOrderItem {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface IShippingInfo {
    name: string;
    email: string;
    phone?: string;
    message?: string;
}

interface IOrder extends Document {
    user: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    shippingInfo: IShippingInfo;
    paymentMethod: 'paypal' | 'visa' | 'mastercard' | 'amex';
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema: Schema<IOrderItem> = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, default: '' },
}, { _id: false });

const shippingInfoSchema: Schema<IShippingInfo> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String },
}, { _id: false });

const orderSchema: Schema<IOrder> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    shippingInfo: { type: shippingInfoSchema, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['paypal', 'visa', 'mastercard', 'amex'], 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
export type { IOrder };
