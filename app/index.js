const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('./global');
const { topRoute } = require('./routes/topRoute');

const baseUrl = '/v1';
const app = express();

class App {
  useView() {
    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'ejs');
  }

  useParser() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
  }

  useHeader() {
    app.set('etag', false);
    app.set('x-powered-by', false);
    app.use((req, res, next) => {
      res.header('access-control-allow-origin', `https://${req.headers.host}`);
      res.header('server', 'acl-ingress-k8s');
      res.header('x-powered-by', 'jsx.jp');
      next();
    });
  }

  usePublic() {
    const docs = path.resolve(process.cwd(), 'public');
    app.use(express.static(docs));
  }

  useLogging() {
    app.use((req, res, next) => {
      const ts = new Date().toLocaleString();
      const progress = () => {
        const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { protocol, method, url } = req;
        const headers = JSON.stringify(req.headers);
        logger.info({
          ts, remoteIp, protocol, method, url, headers,
        });
      };
      progress();
      res.on('finish', () => {
        const { statusCode, statusMessage } = res;
        const headers = JSON.stringify(res.getHeaders());
        logger.info({
          ts, statusCode, statusMessage, headers,
        });
      });
      next();
    });
  }

  useRoute() {
    app.use(baseUrl, topRoute.router);
  }

  notfoundHandler() {
    app.use((req, res) => {
      const template = 'error/default';
      if (req.method === 'GET') {
        const e = createError(404);
        res.locals.e = e;
        res.status(e.status).render(template);
        return;
      }
      const e = createError(501);
      res.status(e.status).json({ message: e.message });
    });
  }

  errorHandler() {
    app.use((e, req, res, done) => {
      (never => never)(done);
      const template = 'error/default';
      if (!e.status) e.status = 503;
      if (req.method === 'GET') {
        res.locals.e = e;
        res.status(e.status).render(template);
        return;
      }
      res.status(e.status).json({ message: e.message });
    });
  }

  start() {
    this.useView();
    this.useParser();
    this.useHeader();
    this.usePublic();
    this.useLogging();
    this.useRoute();
    this.notfoundHandler();
    this.errorHandler();
    return app;
  }
}

module.exports = {
  App,
};
