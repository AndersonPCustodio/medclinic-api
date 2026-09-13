import { Request, Response, NextFunction } from 'express';
import { verificarTokenJWT } from '../utils/jwt';

export interface RequestAutenticada extends Request {
  usuarioLogado?: {
    id: string;
    role: 'Administrador' | 'Atendente';
  };
}

export function middlewareAutenticacao(req: RequestAutenticada, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token de autenticação não informado.' });
    return;
  }

  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    res.status(401).json({ error: 'Formato do token inválido. Use o padrão Bearer.' });
    return;
  }

  const token = partes[1];
  const payload = verificarTokenJWT(token);


  if (!payload) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
    return;
  }

  req.usuarioLogado = payload;
  
  next();
}
