import { logger } from '@jobscale/logger';
import { apiService } from './service.js';

class ApiController {
  slack(req, res) {
    const { body } = req;
    apiService.slack(body)
    .then(result => res.json(result))
    .catch(e => {
      logger.info({ message: e.toString() });
      if (!e.status) e.status = 500;
      res.status(e.status).json({ message: e.message });
    });
  }

  hostname(req, res) {
    apiService.hostname()
    .then(result => res.json(result))
    .catch(e => {
      logger.info({ message: e.toString() });
      if (!e.status) e.status = 500;
      res.status(e.status).json({ message: e.message });
    });
  }
}

export const apiController = new ApiController();
export default { ApiController, apiController };
