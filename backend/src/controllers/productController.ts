// src/controllers/productController.ts

import type { Request, Response } from 'express'; 
import asyncHandler from 'express-async-handler';

// 🎯 CORRECCIÓN FINAL: Se importa el modelo (Product) por defecto y el tipo (IProduct) usando 'import type'.
import Product from '../models/Product.ts'; 
import type { IProduct } from '../models/Product.ts'; 

// GET /api/products
// Obtener todos los productos
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.json(products);
});

// GET /api/products/:id
// Obtener un producto por ID
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Producto no encontrado.');
    }
});

// POST /api/products
// Crear un nuevo producto
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, image, category, countInStock } = req.body;
    
    // Simple validación de campos obligatorios
    if (!name || !price || !image || !category) {
        res.status(400);
        throw new Error('Faltan campos obligatorios para crear el producto.');
    }
    
    const newProduct = new Product({
        name,
        description,
        price,
        image,
        category,
        countInStock,
    });

    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
});

// PUT /api/products/:id
// Actualizar un producto existente
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, image, category, countInStock } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.image = image ?? product.image;
        product.category = category ?? product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Producto no encontrado para actualizar.');
    }
});

// DELETE /api/products/:id
// Eliminar un producto
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Producto eliminado correctamente.' });
    } else {
        res.status(404);
        throw new Error('Producto no encontrado para eliminar.');
    }
});
