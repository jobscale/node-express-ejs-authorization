import { templateService } from './service.js';

class TemplateController {
  load(req, res) {
    const { id } = req.body;
    templateService.now()
    .then(now => {
      const template = id.split('-').join('/');
      res.render(template, { now });
    });
  }
}

export const templateController = new TemplateController();
export default { TemplateController, templateController };
