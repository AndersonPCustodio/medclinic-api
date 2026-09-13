import { Response } from 'express';
import { RequestAutenticada } from '../middlewares/auth.middleware';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
  async getMe(req: RequestAutenticada, res: Response): Promise<Response> {
    try {
      const usuarioId = req.usuarioLogado?.id;

      if (!usuarioId) {
        return res.status(401).json({ error: 'Usuário não identificado.' });
      }

      const usuario = await UserRepository.buscarPorId(usuarioId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        dataCriacao: usuario.dataCriacao
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar dados do usuário.' });
    }
  }

  async adminPing(req: RequestAutenticada, res: Response): Promise<Response> {
    return res.status(200).json({
      message: 'Ping efetuado com sucesso! Acesso concedido apenas para Administradores.',
      timestamp: new Date(),
      admin: {
        id: req.usuarioLogado?.id,
        role: req.usuarioLogado?.role
      }
    });
  }
}
