class UserValidation {
  register(req, res, next) {
    const { login, password } = req.body;
    if (!login) {
      res.status(400).json({ message: 'User Required' });
      return;
    }
    if (!password) {
      res.status(400).json({ message: 'Password Required' });
      return;
    }
    next();
  }

  reset(req, res, next) {
    const { login, password } = req.body;
    if (!login) {
      res.status(400).json({ message: 'User Required' });
      return;
    }
    if (!password) {
      res.status(400).json({ message: 'Password Required' });
      return;
    }
    next();
  }
}

module.exports = {
  UserValidation,
  userValidation: new UserValidation(),
};
