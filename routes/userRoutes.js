const express = require('express');
const { userById, allUsers, getUser, updateUser, deleteUser } = require('../controllers/users');
const { requireSignin } = require('../controllers/auths');

const router = express.Router();

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);

// Will append (execute) userById first for any route containing :userId
router.param('userId', userById);

module.exports = router;