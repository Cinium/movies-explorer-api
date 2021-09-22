require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  limiter, dbAddress, dbConfig, corsOptions,
} = require('./configs/configs');
const routers = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 8000 } = process.env;
const app = express();

app.set('trust proxy', 1);

mongoose.connect(dbAddress, dbConfig);

app.use(requestLogger);

app.use(helmet());
app.use(limiter);

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/', routers);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Port ${PORT} is working`);
});
