require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
    if (!req.cookies.jwt) {
        throw new Unauthorized('Необходима авторизация');
    }

    const token = req.cookies.jwt;
    let payload;

    try {
        payload = jwt.verify(
            token,
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
        );
    } catch (e) {
        const err = new Error('Необходима авторизация');
        err.statusCode = 401;

        next(err);
    }

    req.user = payload;

    next();
};
