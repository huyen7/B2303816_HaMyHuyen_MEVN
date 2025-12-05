const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (userId) => {
 return jwt.sign(
  { userId },
  // 🛑 SỬA: Đổi từ JWT_SECRET thành JWT_ACCESS_SECRET
  process.env.JWT_ACCESS_SECRET,
  // 🛑 SỬA: Đổi từ JWT_EXPIRE thành JWT_ACCESS_EXPIRE
  { expiresIn: process.env.JWT_ACCESS_EXPIRE || '1h' }
 );
};

// Generate refresh token (Không cần sửa, vì tên biến đã khớp)
const generateRefreshToken = (userId) => {
 return jwt.sign(
  { userId },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
 );
};

// Verify refresh token (Không cần sửa, vì tên biến đã khớp)
const verifyRefreshToken = (token) => {
 try {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
 } catch (error) {
  throw new Error('Invalid refresh token');
 }
};

// Generate token pair
const generateTokenPair = (userId) => {
 const accessToken = generateAccessToken(userId);
 const refreshToken = generateRefreshToken(userId);
 
 return {
  accessToken,
  refreshToken,
  // 🛑 SỬA: Đổi từ JWT_EXPIRE thành JWT_ACCESS_EXPIRE
  expiresIn: process.env.JWT_ACCESS_EXPIRE || '1h'
 };
};

module.exports = {
 generateAccessToken,
 generateRefreshToken,
 verifyRefreshToken,
 generateTokenPair
};