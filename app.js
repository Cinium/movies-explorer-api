const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const { login, register, logout } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const {
    requestLogger,
    errorLogger,
} = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const { PORT = 8000 } = process.env;
const app = express();

app.use(requestLogger);

app.use(express.json());
app.use(cookieParser());

app.post(
    '/signin',
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required(),
        }),
    }),
    login
);
app.post(
    '/signup',
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required(),
            name: Joi.string().min(2).max(30),
        }),
    }),
    register
);
app.delete('/signout', logout);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use(errorLogger);

app.use((req, res, next) => {
    next(new NotFoundError('Маршрут не найден'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Port ${PORT} is working`);
});
