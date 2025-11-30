import { Router } from 'express';
import { accountController } from './controller.js';
import { accountValidation } from './validation.js';

class AccountRoute {
  constructor() {
    const router = Router();
    router.get(
      '/password',
      (...args) => accountController.password(...args),
    );
    router.post(
      '/password',
      (...args) => accountValidation.password(...args),
      (...args) => accountController.password(...args),
    );
    this.router = router;
  }
}

export const accountRoute = new AccountRoute();
export default { AccountRoute, accountRoute };
