require('dotenv').config();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/configs');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (e) {
    const err = new UnauthorizedError('Необходима авторизация');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload;

  next();
};
