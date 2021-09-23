const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret } = require('../configs/configs');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Переданы неверные данные');
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

const changeUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.codeName === 'DuplicateKey') {
        throw new ConflictError('Такой email уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new UnauthorizedError('Пользователь не найден');
      }
      next(err);
    })
    .catch((err) => next(err));
};

const register = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Отсутсвует почта или пароль');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Такой email уже существует');
      }
      next(err);
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;
  let userData;

  if (!email || !password) {
    throw new BadRequestError('Отсутсвует почта или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      userId = user._id;
      userData = user;

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      const token = jwt.sign(
        { _id: userId },
        jwtSecret,
        {
          expiresIn: '7d',
        },
      );

      return res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .send(userData);
    })
    .catch((err) => next(err));
};

const logout = (req, res) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Некого разлогинивать');
  }

  const token = req.cookies.jwt;

  return res
    .cookie('jwt', token, {
      maxAge: 0,
    })
    .status(200)
    .send({ message: 'Токен успешно закончился' });
};

module.exports = {
  register,
  login,
  getUser,
  changeUserInfo,
  logout,
};
