import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { CriarUsuarioDTO, RespostaUsuarioDTO } from '../utils/user.dto';
import { gerarHashSenha } from '../utils/password';

export class AuthService {
  async registrarUsuario(dados: CriarUsuarioDTO): Promise<RespostaUsuarioDTO> {
    const { nome, email, senhaPura, role } = dados;

    if (!nome || !email || !senhaPura) {
      throw new Error('CAMPO_OBRIGATORIO_AUSENTE');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('EMAIL_FORMATO_INVALIDO');
    }

    const usuarioExistente = await UserRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('EMAIL_DUPLICADO');
    }

    const senhaCriptografada = await gerarHashSenha(senhaPura);

    const novoUsuario = new User();
    novoUsuario.nome = nome;
    novoUsuario.email = email;
    novoUsuario.senha = senhaCriptografada;
    if (role) novoUsuario.role = role;

    const usuarioSalvo = await UserRepository.save(novoUsuario);

    return {
      id: usuarioSalvo.id,
      nome: usuarioSalvo.nome,
      email: usuarioSalvo.email,
      role: usuarioSalvo.role,
      dataCriacao: usuarioSalvo.dataCriacao,
    };
  }

    async loginUsuario(email: string, senhaPura: string): Promise<{ token: string }> {
    if (!email || !senhaPura) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const usuario = await UserRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const senhaValida = await import('../utils/password').then(m => m.compararSenha(senhaPura, usuario.senha));
    if (!senhaValida) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const token = await import('../utils/jwt').then(m => m.gerarTokenJWT({
      id: usuario.id,
      role: usuario.role
    }));

    return { token };
  }

}
