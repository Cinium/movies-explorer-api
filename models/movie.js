const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },
  trailer: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

function toJSON() {
  const object = this.toObject();
  delete object.password;
  return object;
}

movieSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('movie', movieSchema);
