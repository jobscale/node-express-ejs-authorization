const os = require('os');
const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
require('@jobscale/core');
const { route } = require('./route');

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
      const origin = req.headers.origin || `${req.protocol}://${req.headers.host}`;
      res.header('Access-Control-Allow-Origin', `${origin}`);
      res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Server', 'acl-ingress-k8s');
      res.header('X-Backend-Host', os.hostname());
      next();
    });
  }

  usePublic() {
    const docs = path.resolve(process.cwd(), 'docs');
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
    app.use('', route.router);
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
