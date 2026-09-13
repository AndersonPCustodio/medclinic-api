import { Response, NextFunction } from 'express';
import { RequestAutenticada } from './auth.middleware';

export function autorizarPerfis(perfisPermitidos: ('Administrador' | 'Atendente')[]) {
  return (req: RequestAutenticada, res: Response, next: NextFunction): void => {
    const usuario = req.usuarioLogado;

    if (!usuario) {
      res.status(401).json({ error: 'Usuário não autenticado.' });
      return;
    }

    if (!perfisPermitidos.includes(usuario.role)) {
      res.status(403).json({ error: 'Acesso negado. Perfil sem permissão para este recurso.' });
      return;
    }

    next();
  };
}
