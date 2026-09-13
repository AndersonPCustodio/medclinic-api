import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "MedClinic API - Servidor rodando com sucesso!" });
});

app.listen(PORT, () => {
  console.log(`[server]: Servidor inicializado e escutando na porta ${PORT}`);
});
