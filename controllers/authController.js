const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { user, isNew } = await authService.registerUser(req.body);
    res.status(isNew ? 201 : 200).json({
      message: isNew ? 'Account created, OTP sent' : 'New OTP sent',
      email: user.email,
      otp: user.otp, 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);
    res.json({ message: 'OTP sent', email: user.email, otp: user.otp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { accessToken, rememberToken } = await authService.verifyUserOtp(req.body);
    res.json({ message: 'OTP verified', accessToken, rememberToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.autoLogin = async (req, res) => {
  try {
    const rememberToken = req.header('remembertoken');
    if (!rememberToken) return res.status(401).json({ message: 'Missing rememberToken' });

    const accessToken = await authService.autoLoginUser(rememberToken);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing access token' });

    await authService.logoutUser(token);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
