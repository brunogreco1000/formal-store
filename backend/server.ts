import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// 🔹 Rutas
import authRoutes from './src/routes/authRoutes.ts';
import cartRoutes from './src/routes/cartRoutes.ts';
import productRoutes from './src/routes/productRoutes.ts';
import orderRoutes from './src/routes/orderRoutes.ts';

dotenv.config();

const app = express();

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// MongoDB
const mongoUri = process.env.MONGO_URI || '';
mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => {
        console.error('❌ Error MongoDB:', err);
        process.exit(1);
    });

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);

// Middleware de error
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error en request:', req.method, req.originalUrl, err);
    res.status(err.status || 500).json({
        message: err.message
    });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => console.log(`🚀 Server corriendo en puerto ${PORT}`));
