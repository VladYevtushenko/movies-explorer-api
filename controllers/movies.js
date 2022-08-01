const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const { inputsError } = require('../utils/inputsError');
const User = require('../models/user');

// GET: list of all movies created by current user

module.exports.getMovies = async (req, res, next) => {
  const owner = await User.findById(req.user._id);
  Movie.find({})
    .populate('owner')
    .then((movie) => {
      const result = movie.filter((e) => e.owner._id.toString() === owner._id.toString());
      return res.send(result);
    })
    .catch(next);
};

// POST: add new movie

module.exports.addNewMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = await User.findById(req.user._id);

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then(async (movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Неверно указаны данные в полях: ${inputsError(err)}`));
        return;
      }
      next(err);
    });
};

// DELETE: delete movie by _ID

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => new NotFoundError('Фильм с указанным id не найдена'))
    .then((movie) => {
      if (String(movie.owner._id) !== String(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
      Movie.findByIdAndRemove(req.params._id)
        .then((movieDelete) => res.send(movieDelete))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Неверно указаны данные в полях: ${inputsError(err)}`));
        return;
      }
      next(err);
    });
};
