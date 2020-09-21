const express = require('express');
const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto, addFollowing, addFollower, removeFollowing, removeFollower, findPeople } = require('../controllers/users');
const { requireSignin } = require('../controllers/auths');

const router = express.Router();

// When executed, the user will be adding to its own following list and adding itself to the fetched profile followers list
router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);
router.get('/user/photo/:userId', userPhoto);

router.get('/user/findpeople/:userId', requireSignin, findPeople)

// Will append (execute) userById first for any route containing :userId
router.param('userId', userById);

module.exports = router;