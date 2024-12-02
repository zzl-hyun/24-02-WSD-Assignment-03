require('dotenv').config();
const jwt = require('jsonwebtoken');

const payload = { id: '12345', role: 'user' };
const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
