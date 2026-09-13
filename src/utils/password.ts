import bcrypt from 'bcrypt';

export async function gerarHashSenha(senha: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(senha, salt);
}

export async function compararSenha(senhaPura: string, senhaHash: string): Promise<boolean> {
  return bcrypt.compare(senhaPura, senhaHash);
}
