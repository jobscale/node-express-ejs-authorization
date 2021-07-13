class AccountValidation {
  password(req, res, next) {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ message: 'Password Required' });
      return;
    }
    next();
  }
}

module.exports = {
  AccountValidation,
  accountValidation: new AccountValidation(),
};
