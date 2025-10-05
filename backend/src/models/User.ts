import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Interfaz del User (SIN la palabra clave 'export' inicial)
interface IUser extends Document { 
  _id: Types.ObjectId;   
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema del usuario
const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Modelo tipado
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// Exportación del Modelo por defecto
export default User;

// 🔑 Solución: Exportamos la interfaz DE FORMA NOMBRADA aquí, 
// lo cual es reconocido por el cargador de módulos de Node.js.
export type { IUser };