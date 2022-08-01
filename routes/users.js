const router = require('express').Router();
const { userIdValidation, userInfoEditingValidation } = require('../middlewares/validations');
const { getUser, editUserInfo } = require('../controllers/users');

// GET user info by ID

router.get('/me', userIdValidation, getUser);

// PATCH update user info

router.patch('/me', userInfoEditingValidation, editUserInfo);

module.exports = router;
