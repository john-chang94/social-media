const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { signUpValidator } = require('../helpers/validator');

const router = express.Router();

router.post('/signup', signUpValidator, signUp);
router.post('/signin', signIn);

// Will execute userById first for any route containing :userId
router.param('userId', userById);

module.exports = router;