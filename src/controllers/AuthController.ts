import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const resultado = await authService.registrarUsuario(req.body);
      return res.status(201).json(resultado);
    } catch (error: any) {
      if (error.message === 'EMAIL_DUPLICADO') {
        return res.status(409).json({ error: 'O e-mail informado já está cadastrado.' });
      }
      if (error.message === 'EMAIL_FORMATO_INVALIDO') {
        return res.status(400).json({ error: 'O formato do e-mail informado é inválido.' });
      }
      if (error.message === 'CAMPO_OBRIGATORIO_AUSENTE') {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
      }
      return res.status(500).json({ error: 'Erro interno no servidor ao realizar o cadastro.' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.loginUsuario(email, senha);
      return res.status(200).json(resultado);
    } catch (error: any) {
      if (error.message === 'CREDENCIAIS_INVALIDAS') {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }
      return res.status(500).json({ error: 'Erro interno no servidor ao realizar o login.' });
    }
  }
}
