const express = require('express');
const { userById, allUsers, getUser, updateUser, deleteUser } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.get('/users', allUsers);
router.get('/users/:userId', requireSignin, getUser);
router.put('/users/:userId', requireSignin, updateUser);
router.delete('/users/:userId', requireSignin, deleteUser);

// Will append (execute) userById first for any route containing :userId
router.param('userId', userById);

module.exports = router;