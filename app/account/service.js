import createHttpError from 'http-errors';
import { auth } from '../auth.js';
import { createHash } from '../user.js';
import User from '../models/User.js';

class AccountService {
  async password(rest) {
    const { password, token } = rest;
    const { login } = auth.decode(token);
    return User.findOne({
      raw: true,
      attributes: ['login'],
      where: { login },
    })
    .then(user => {
      if (!user) throw createHttpError(400);
      user.hash = createHash(`${login}/${password}`);
      return User.update(user, {
        where: { login },
      });
    })
    .then(() => ({ login }));
  }
}

export const accountService = new AccountService();
export default { AccountService, accountService };
