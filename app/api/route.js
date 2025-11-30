import { Router } from 'express';
import { apiController } from './controller.js';
import { apiValidation } from './validation.js';

class ApiRoute {
  constructor() {
    const router = Router();
    router.post(
      '/slack',
      (...args) => apiValidation.slack(...args),
      (...args) => apiController.slack(...args),
    );
    router.post(
      '/hostname',
      (...args) => apiController.hostname(...args),
    );
    this.router = router;
  }
}

export const apiRoute = new ApiRoute();
export default { ApiRoute, apiRoute };
