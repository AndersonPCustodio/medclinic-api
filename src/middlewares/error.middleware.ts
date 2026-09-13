import { Request, Response, NextFunction } from 'express';

export function middlewareTratamentoErros(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[error]: Ocorreu um erro na operação:', error.message);
  
  res.status(500).json({
    error: 'Erro interno no servidor.',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
