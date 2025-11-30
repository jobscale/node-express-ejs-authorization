import { Router } from 'express';
import { templateController } from './controller.js';

class TemplateRoute {
  constructor() {
    const router = Router();
    router.post(
      '',
      (...args) => templateController.load(...args),
    );
    this.router = router;
  }
}

export const templateRoute = new TemplateRoute();
export default { TemplateRoute, templateRoute };
