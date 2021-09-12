module.exports = (err, req, res, next) => {
  const { statusCode, message } = err;

  if (statusCode) {
    res.status(statusCode).send({ message });
  } else {
    res.status(500).send({ message: 'Ошибка на сервере' });
  }

  next();
};
