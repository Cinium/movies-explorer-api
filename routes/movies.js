const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const pattern = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/;

router.get('/', getSavedMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().pattern(pattern),
        trailer: Joi.string().pattern(pattern),
        thumbnail: Joi.string().pattern(pattern),
        movieId: Joi.number().required(),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
      })
      .unknown(true),
  }),
  createMovie,
);

router.delete('/:movieId', celebrate({
  params: Joi.object()
    .keys({
      movieId: Joi.string().hex().length(24),
    }),
}), deleteMovie);

module.exports = router;
