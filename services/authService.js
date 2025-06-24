const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-your-secret';
const ACCESS_TOKEN_EXPIRY = '15m';

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

const generateRememberToken = () => crypto.randomBytes(32).toString('hex');

const registerUser = async ({ username, email, password }) => {
  let user = await User.findOne({ email });

  if (user && user.isVerified) throw new Error('Email already in use');

  if (!user) {
    user = new User({ username, email, password, isVerified: false });
  } else {
    user.username = username;
    user.password = password;
  }

  user.otp = generateOTP();
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  return { user, isNew: user.isNew };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email, password });
  if (!user) throw new Error('Invalid credentials');
  if (!user.isVerified) throw new Error('Please verify your email first');

  user.otp = generateOTP();
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  return user;
};

const verifyUserOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  if (user.otpExpires < Date.now()) throw new Error('OTP expired');
  if (user.otp !== otp) throw new Error('Invalid OTP');

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  const accessToken = generateAccessToken(user._id);
  const rememberToken = generateRememberToken();
  user.accessToken = accessToken;
  user.rememberToken = rememberToken;

  await user.save();
  return { accessToken, rememberToken };
};

const autoLoginUser = async (rememberToken) => {
  const user = await User.findOne({ rememberToken });
  if (!user) throw new Error('Invalid token');

  const newAccessToken = generateAccessToken(user._id);
  user.accessToken = newAccessToken;
  await user.save();

  return newAccessToken;
};

const logoutUser = async (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  await User.findByIdAndUpdate(payload.userId, {
    accessToken: undefined,
    rememberToken: undefined,
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyUserOtp,
  autoLoginUser,
  logoutUser,
};
