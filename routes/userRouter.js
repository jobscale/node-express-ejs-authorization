const { BaseRouter } = require('./baseRouter');

class UserRouter extends BaseRouter {
  route() {
    this.get('/', (req, res) => {
      res.render('index', { title: 'User' });
    });
    return this.router;
  }
}

module.exports = {
  UserRouter,
};
