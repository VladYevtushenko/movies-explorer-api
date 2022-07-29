const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');
const { userInfoValidation, loginValidation } = require('../middlewares/validations');

// registration

router.post('/signup', userInfoValidation, createUser);

// login

router.post('/signin', loginValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.get('/signout', signout);

router.use('*', (req, res, next) => next(
  new NotFoundError('Ресурс не найден'),
));

module.exports = router;
