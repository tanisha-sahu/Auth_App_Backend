const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    console.error('login error:', err);
    res.status(err.code || 500).json({ message: err.message || 'Server error' });
  }
};

exports.autoLogin = (req, res) => {
  try {
    const data = authService.autoLogin(req.headers.authorization);
    res.json(data);
  } catch (err) {
    console.error('autoLogin error:', err);
    res.status(err.code || 500).json({ message: err.message || 'Server error' });
  }
};

exports.logout = (_req, res) => {
  res.json({ message: 'Logged out' }); // Stateless JWT logout
};
