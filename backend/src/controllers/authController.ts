// src/controllers/authController.ts

// 1. CORRECCIÓN: Importar Request/Response como TIPOS
import type { Request, Response } from 'express'; 

// 2. CORRECCIÓN: Separar el modelo (default) del tipo (nombrado)
import User from '../models/User.ts'; 
import type { IUser } from '../models/User.ts'; 

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // Usar para limpiar los try/catch

// Registrar usuario
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(409); // 409 Conflict
        throw new Error('El email ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Nota: El método create devuelve el documento creado, tipado como IUser.
    const newUser: IUser = await User.create({ email, password: hashedPassword });
    
    res.status(201).json({ id: newUser._id, email: newUser.email });
});

// Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const user: IUser | null = await User.findOne({ email });
    
    if (!user) {
        res.status(401);
        throw new Error('Usuario o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        res.status(401);
        throw new Error('Usuario o contraseña incorrectos');
    }

    const token = jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
    );

    // Cookie HttpOnly para seguridad
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        maxAge: 24 * 60 * 60 * 1000 
    });
    
    res.json({ id: user._id, email: user.email });
});

// Logout
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
});

// Revisar sesión activa
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.token;
    
    if (!token) {
        res.status(401);
        throw new Error('No autenticado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('_id email');
    
    if (!user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    res.json({ id: user._id, email: user.email });
});