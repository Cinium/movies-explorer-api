require('dotenv').config();
const rateLimit = require('express-rate-limit');

const { NODE_ENV, DB_ADDRESS, JWT_SECRET } = process.env;

const jwtDevSecret = 'jwt-dev-secret';
const dbDevAddress = 'mongodb://localhost:27017/moviesdb';

const dbConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
});

const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : jwtDevSecret;
const dbAddress = NODE_ENV === 'production' ? DB_ADDRESS : dbDevAddress;

module.exports = {
  dbConfig, dbAddress, limiter, jwtSecret,
};
