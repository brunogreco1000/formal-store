import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  material: String,
  category: String,
  size: String,
  color: String,
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
