import { Router } from 'express';
import { apiRoute } from './api/route.js';
import { authRoute } from './auth/route.js';
import { accountRoute } from './account/route.js';
import { userRoute } from './user/route.js';
import { templateRoute } from './template/route.js';
import { controller } from './controller.js';

class Route {
  constructor() {
    const router = Router();
    router.use(
      '/api',
      (...args) => apiRoute.router(...args),
    );
    router.use(
      '',
      (...args) => authRoute.router(...args),
    );
    router.use(
      '/account',
      (...args) => accountRoute.router(...args),
    );
    router.use(
      '/user',
      (...args) => userRoute.router(...args),
    );
    router.use(
      '/template',
      (...args) => templateRoute.router(...args),
    );
    router.get(
      '',
      (...args) => controller.page(...args),
    );
    this.router = router;
  }
}

export const route = new Route();
export default { Route, route };
