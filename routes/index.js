const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const { userInfoValidation, loginValidation } = require('../middlewares/validations');

// registration

router.post('/signup', userInfoValidation, createUser);

// login

router.post('/signin', loginValidation, login);

router.use(userRouter);
router.use(movieRouter);

router.use('*', (req, res, next) => next(
  new NotFoundError('Ресурс не найден'),
));

module.exports = router;
