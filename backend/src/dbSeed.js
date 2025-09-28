import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Cart from './models/Cart.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Conexión a MongoDB exitosa ✅');

    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    console.log('Colecciones limpiadas ✅');

    const hashedPassword = await bcrypt.hash('EternalPain1000!', 10);
    const user = await User.create({ email: 'paulallen@gmail.com', password: hashedPassword });

    const productsData = [
      { name: "Traje Elegante", price: 250, image: "/images/traje-elegante.jpg", description: "Traje elegante de corte clásico", material: "Lana 100%", category: "Trajes", size: "M, L, XL", color: "Negro" },
      { name: "Zapatos de Cuero", price: 120, image: "/images/zapatos-cuero.jpg", description: "Zapatos de cuero genuino", material: "Cuero", category: "Calzado", size: "39-45", color: "Marrón" },
      { name: "Camisa Formal", price: 70, image: "/images/camisa-formal.png", description: "Camisa de algodón premium", material: "Algodón 100%", category: "Camisas", size: "S, M, L, XL", color: "Blanco" },
      { name: "Corbata de Seda", price: 35, image: "/images/corbata-seda.webp", description: "Corbata de seda elegante", material: "Seda", category: "Accesorios", size: "Única", color: "Azul Marino" }
    ];

    const products = await Product.insertMany(productsData);

    await Cart.create([
      { userId: user._id, productId: products[0]._id, quantity: 2 },
      { userId: user._id, productId: products[1]._id, quantity: 1 }
    ]);

    console.log('Datos iniciales cargados correctamente ✅');
    mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
    process.exit();
  } catch (err) {
    console.error('Error al cargar datos iniciales:', err);
    process.exit(1);
  }
};

seedData();
