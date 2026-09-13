import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { CriarUsuarioDTO, RespostaUsuarioDTO } from '../utils/user.dto';
import { gerarHashSenha } from '../utils/password';

export class AuthService {
  async registrarUsuario(dados: CriarUsuarioDTO): Promise<RespostaUsuarioDTO> {
    const { nome, email, senhaPura, role } = dados;

    // Validação estrita de campos obrigatórios (RF05)
    if (!nome || !email || !senhaPura) {
      throw new Error('CAMPO_OBRIGATORIO_AUSENTE');
    }

    // Validação básica do formato de e-mail (RF05)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('EMAIL_FORMATO_INVALIDO');
    }

    // Impede e-mails duplicados no banco de dados (RF05 / RF11)
    const usuarioExistente = await UserRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('EMAIL_DUPLICADO');
    }

    // Criptografa a senha de forma segura antes de persistir (RF06)
    const senhaCriptografada = await gerarHashSenha(senhaPura);

    // Instancia e salva a entidade no banco de dados
    const novoUsuario = new User();
    novoUsuario.nome = nome;
    novoUsuario.email = email;
    novoUsuario.senha = senhaCriptografada;
    if (role) novoUsuario.role = role;

    const usuarioSalvo = await UserRepository.save(novoUsuario);

    // Retorna os dados mapeados através do DTO de saída, sem expor a senha
    return {
      id: usuarioSalvo.id,
      nome: usuarioSalvo.nome,
      email: usuarioSalvo.email,
      role: usuarioSalvo.role,
      dataCriacao: usuarioSalvo.dataCriacao,
    };
  }
}
