const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');

const { inputsError } = require('../utils/inputsError');

const { NODE_ENV, JWT_SECRET } = process.env;

// POST create user

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res
        .status(200)
        .send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя, неверно указаны данные в полях: ${inputsError(err)}`));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с указанным email уже зарегистрован'));
      } else {
        next(err);
      }
    });
};

// login

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res
        .status(200)
        .send({ message: 'Вы вошли!', token });
    })
    .catch(next);
};

// GET lookup user

module.exports.getUser = (req, res, next) => User
  .findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с таким id не найден');
    }
    res
      .status(200)
      .send(user);
  })
  .catch(next);

// PATCH user info editing

module.exports.editUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
        return;
      }
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные при изменении данных пользователя, неверно указаны данные в полях: ${inputsError(err)}`));
        return;
      }

      if (err.code === 11000) {
        next(new ConflictError('Указаный email принадлежит другому пользователю'));
        return;
      }
      next(err);
    });
};

// signout

module.exports.signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};
