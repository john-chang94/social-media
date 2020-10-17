const express = require('express');
const { signUp, signIn, forgotPassword, resetPassword } = require('../controllers/auths');
const { userById } = require('../controllers/users');
const { signUpValidator, passwordResetValidator } = require('../helpers/validator');

const router = express.Router();

router.post('/signup', signUpValidator, signUp);
router.post('/signin', signIn);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);

// Will execute userById first for any route containing :userId
router.param('userId', userById);

module.exports = router;