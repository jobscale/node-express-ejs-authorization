const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { Router } = require('./routes');

class App {
  constructor() {
    this.app = express();
    this.handle = (...args) => this.app(...args);
    this.set = (...args) => this.app.set(...args);
    this.use = (...args) => {
      const [uri] = args;
      if (typeof uri === 'string') {
        args[0] = path.join('/auth', uri);
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
    this.use(express.static(path.resolve(__dirname, 'public')));
  }

  useRoute() {
    this.use('/', new Router().route());
  }

  useHandler() {
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
    this.use((e, req, res, done) => {
      const template = 'error/default';
      if (!e.status) e.status = 500;
      res.locals.e = e;
      res.status(e.status).render(template);
      done();
    });
  }

  start() {
    this.useView();
    this.useParser();
    this.useHeader();
    this.usePublic();
    this.useRoute();
    this.useHandler();
    return this.handle;
  }
}

module.exports = {
  App,
};
