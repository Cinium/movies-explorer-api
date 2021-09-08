const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const getSavedMovies = (req, res, next) => {
    Movie.find({ owner: req.user._id })
        .then(movies => {
            if (!movies) {
                throw new BadRequest('Переданы неверные данные');
            }
            res.send(movies);
        })
        .catch(err => next(err));
};

const createMovie = (req, res, next) => {
    const {
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
    } = req.body;

    Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: req.user._id,
    })
        .then(movie => {
            res.send(movie);
        })
        .catch(err => next(err));
};

const deleteMovie = (req, res, next) => {
    const userId = req.user._id;
    const { movieId } = req.params;

    Movie.findById(movieId)
        .then(movie => {
            if (!movie) {
                throw new NotFoundError('Фильм не найден');
            }
            if (!movie.owner.equals(userId)) {
                throw new Forbidden(
                    'Карточки может удалять только их владелец'
                );
            }

            return Movie.findByIdAndRemove(movieId);
        })
        .then(movie => {
            res.status(200).send(movie);
        })
        .catch(err => next(err));
};

module.exports = {
    getSavedMovies,
    createMovie,
    deleteMovie,
};
