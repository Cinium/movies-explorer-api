const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new BadRequestError('Переданы неверные данные');
      }
      res.send(movies);
    })
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    description,
    director,
    duration,
    movieId,
    image,
    nameEN,
    nameRU,
    trailer,
    year,
    thumbnail,
  } = req.body;

  Movie.create({
    country,
    description,
    director,
    duration,
    movieId,
    image,
    nameEN,
    nameRU,
    trailer,
    year,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findOneAndDelete({ movieId, owner: userId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (!movie.owner.equals(userId)) {
        throw new ForbiddenError('Фильмы может удалять только их владелец');
      }

      // return Movie.findByIdAndRemove(movieId);
      res.status(200).send({ deleted: movie.movieId });
    })
    // .then((movie) => {
    //   res.status(200).send(movie);
    // })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Неверный ID фильма');
      }
      next(err);
    })
    .catch((err) => next(err));
};

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
