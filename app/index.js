const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('./global');
const { topRoute } = require('./routes/topRoute');

class App {
  constructor() {
    this.app = express();
    this.handle = (...args) => this.app(...args);
    this.set = (...args) => this.app.set(...args);
    this.use = (...args) => {
      if (typeof args[0] === 'string') {
        args[0] = path.join(baseUrl, args[0]);
      }
      this.app.use(...args);
    };
  }

  useView() {
    this.set('views', path.resolve(__dirname, 'views'));
    this.set('view engine', 'ejs');
  }

  useParser() {
    this.use(express.json());
    this.use(express.urlencoded({ extended: false }));
    this.use(cookieParser());
  }

  useHeader() {
    this.set('etag', false);
    this.set('x-powered-by', false);
    this.use((req, res, next) => {
      res.header('access-control-allow-origin', `https://${req.headers.host}`);
      res.header('x-powered-by', 'nginx');
      next();
    });
  }

  usePublic() {
    this.use(express.static(path.resolve(__dirname, '../public')));
  }

  useLogging() {
    this.use((req, res, next) => {
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
    this.use('', topRoute.router);
  }

  notfoundHandler() {
    this.use((req, res) => {
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
    this.use((e, req, res, done) => {
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
    return this.handle;
  }
}

module.exports = {
  App,
};
