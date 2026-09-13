export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senhaPura: string;
  role?: 'Administrador' | 'Atendente';
}

export interface RespostaUsuarioDTO {
  id: string;
  nome: string;
  email: string;
  role: 'Administrador' | 'Atendente';
  dataCriacao: Date;
}
