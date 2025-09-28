import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const formatCartItem = (item) => ({
  id: item._id.toString(),
  productId: item.productId._id.toString(),
  name: item.productId.name,
  price: item.productId.price,
  image: item.productId.image,
  quantity: item.quantity,
});

export const getCart = async (req, res) => {
  try {
    if (!req.user) return res.json([]);
    const items = await Cart.find({ userId: req.user.id }).populate('productId');
    res.json(items.map(formatCartItem));
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener carrito', error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Usuario no logueado' });
    const { productId, quantity } = req.body;
    let item = await Cart.findOne({ userId: req.user.id, productId }).populate('productId');
    if (item) {
      item.quantity += quantity || 1;
      await item.save();
    } else {
      item = await Cart.create({ userId: req.user.id, productId, quantity });
      item = await item.populate('productId');
    }
    res.status(201).json(formatCartItem(item));
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar al carrito', error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Usuario no logueado' });
    const { quantity } = req.body;
    const item = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { quantity },
      { new: true }
    ).populate('productId');
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(formatCartItem(item));
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar item', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Usuario no logueado' });
    const deleted = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado correctamente', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar item', error: err.message });
  }
};
