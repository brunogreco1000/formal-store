import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import productRoutes from './src/routes/productRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado ✅'))
  .catch((err) => {
    console.error('Error MongoDB:', err);
    process.exit(1);
  });

// Rutas con /api prefijo
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);

// Middleware de error general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server corriendo en puerto ${PORT} 🚀`));
