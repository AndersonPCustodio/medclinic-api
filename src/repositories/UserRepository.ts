import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async buscarPorEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  },

  async buscarPorId(id: string): Promise<User | null> {
    return this.findOne({ where: { id } });
  }
});
