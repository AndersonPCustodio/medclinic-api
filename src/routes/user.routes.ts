import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { middlewareAutenticacao } from '../middlewares/auth.middleware';
import { autorizarPerfis } from '../middlewares/rbac.middleware';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/me', middlewareAutenticacao, userController.getMe);

userRouter.get('/admin/ping', middlewareAutenticacao, autorizarPerfis(['Administrador']), userController.adminPing);

export default userRouter;
