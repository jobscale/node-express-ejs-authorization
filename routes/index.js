const { BaseRouter } = require('./baseRouter');
const { UserRouter } = require('./userRouter');

class Router extends BaseRouter {
  route() {
    this.get('/', (req, res) => {
      res.render('index', { title: 'Top' });
    });
    this.use('/user', new UserRouter().route());
    return this.router;
  }
}

module.exports = {
  Router,
};
