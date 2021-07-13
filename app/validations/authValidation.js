class AuthValidation {
  login(req, res, next) {
    const { login } = req.body;
    if (!login) {
      res.status(400).json({ message: 'User Required' });
      return;
    }
    next();
  }
}

module.exports = {
  AuthValidation,
  authValidation: new AuthValidation(),
};
