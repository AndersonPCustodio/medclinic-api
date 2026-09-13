import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'chave_padrao_secreta';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

interface PayloadToken {
  id: string;
  role: 'Administrador' | 'Atendente';
}

export function gerarTokenJWT(payload: PayloadToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verificarTokenJWT(token: string): PayloadToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as PayloadToken;
  } catch (error) {
    return null;
  }
}
