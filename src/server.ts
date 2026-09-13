import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './database/data-source';
import authRouter from './routes/authroutes';
import userRouter from './routes/user.routes';
import { middlewareTratamentoErros } from './middlewares/error.middleware';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "MedClinic API - Servidor rodando com sucesso!" });
});

app.use(middlewareTratamentoErros); 

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('[database]: Conexão com o PostgreSQL estabelecida com sucesso via TypeORM!');
    
    app.listen(PORT, () => {
      console.log(`[server]: Servidor inicializado e escutando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('[database]: Erro fatal ao conectar com o banco de dados:', error);
  });
