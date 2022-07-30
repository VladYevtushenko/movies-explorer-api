const Joi = require('joi');
const { celebrate } = require('celebrate');
const { urlValidation } = require('../utils/urlValidation');

// eslint-disable-next-line no-console
console.log({ urlValidation });

const userInfoValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
});

const userInfoEditingValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const movieInfoValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(80).required(),
    director: Joi.string().min(2).max(80).required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().min(2).required(),
    image: Joi.string().required().custom(urlValidation),
    trailerLink: Joi.string().custom(urlValidation).required(),
    thumbnail: Joi.string().custom(urlValidation).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(2).max(100).required(),
    nameEN: Joi.string().min(2).max(100).required(),
  }),
});

module.exports = {
  userInfoValidation,
  loginValidation,
  userIdValidation,
  userInfoEditingValidation,
  movieInfoValidation,
};
