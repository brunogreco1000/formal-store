import jwt from 'jsonwebtoken';

/**
 * Genera un token JWT para un usuario.
 * @param id - El ID del usuario que se incluirá en el payload.
 * @returns El token JWT firmado.
 */
const generateToken = (id: string): string => {
  // ⚠️ DEBUG: Muestra la clave usada para FIRMAR
  console.log('--- GENERATE TOKEN SECRET ---');
  console.log(`Clave usada: '${process.env.JWT_SECRET}'`);
  console.log('-----------------------------');

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definida en el entorno');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export default generateToken;
