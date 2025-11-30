import createHttpError from 'http-errors';
import User from '../models/User.js';
import { createHash } from '../user.js';
import { auth } from './index.js';

const jwtSecret = 'node-express-ejs';

class AuthService {
  async now() {
    return new Date().toISOString();
  }

  login(rest) {
    const { login, password } = rest;
    const ts = new Date().toISOString();
    const hash = createHash(`${login}/${password}`);
    return User.findOne({
      raw: true,
      attributes: ['login', 'lastLogin'],
      where: {
        login, hash,
      },
    })
    .then(user => {
      if (!user) throw createHttpError(401);
      user.lastLogin = ts;
      return user;
    })
    .then(user => User.update(user, {
      where: {
        login, hash,
      },
    }))
    .then(() => {
      const token = auth.sign({ login, ts }, jwtSecret);
      return token;
    });
  }

  async verify(token) {
    if (!token) throw createHttpError(400);
    if (!auth.verify(token, jwtSecret)) throw createHttpError(403);
  }
}

export const authService = new AuthService();
export default { AuthService, authService };
