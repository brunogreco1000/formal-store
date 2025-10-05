import express from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.ts';
import type { IUser } from '../models/User.ts';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const protect = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401);
        throw new Error('No autorizado, no hay token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findById(decoded.id).select('-password') as IUser | null;

        if (!user) {
            res.status(401);
            throw new Error('No autorizado, usuario no encontrado');
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(401);
        throw new Error('No autorizado, token inválido o expirado');
    }
});

export default protect;
