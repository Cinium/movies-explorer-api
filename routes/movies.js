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
        // country: Joi.string().required(),
        description: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        movieId: Joi.number().required(),
        image: Joi.string().pattern(pattern),
        nameEN: Joi.string().required(),
        nameRU: Joi.string().required(),
        trailer: Joi.string().pattern(pattern),
        year: Joi.string().required(),
        thumbnail: Joi.string().pattern(pattern),
      })
      .unknown(true),
  }),
  createMovie,
);

router.delete('/:movieId', celebrate({
  params: Joi.object()
    .keys({
      movieId: Joi.number(),
    }),
}), deleteMovie);

module.exports = router;
