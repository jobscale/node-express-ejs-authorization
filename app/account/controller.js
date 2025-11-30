import { accountService } from './service.js';

class AccountController {
  password(req, res) {
    const { method, body } = req;
    const { password } = body;
    if (method === 'GET') {
      res.render('account/password', { title: 'Password' });
      return;
    }
    const { token } = req.cookies;
    accountService.password({ password, token })
    .then(user => {
      const { login } = user;
      res.json({ login });
    })
    .catch(e => {
      if (!e.status) e.status = 503;
      res.status(e.status).json({ message: e.message });
    });
  }
}

export const accountController = new AccountController();
export default { AccountController, accountController };
