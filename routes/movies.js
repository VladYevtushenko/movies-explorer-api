const router = require('express').Router();
const { getMovies, addNewMovie, deleteMovie } = require('../controllers/movies');
const { userIdValidation, movieInfoValidation } = require('../middlewares/validations');

// GET movies added by current User

router.get('/', userIdValidation, getMovies);

// POST add new movie

router.post('/', movieInfoValidation, addNewMovie);

// DELETE added movie by id

router.delete('/:_id', userIdValidation, deleteMovie);

module.exports = router;
