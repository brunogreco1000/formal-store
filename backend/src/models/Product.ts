import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  countInStock: number;
  material?: string;  // opcional
  size?: string;      // opcional
  color?: string;     // opcional
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
  material: { type: String },
  size: { type: String },
  color: { type: String }
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
export default Product;
export type { IProduct };
