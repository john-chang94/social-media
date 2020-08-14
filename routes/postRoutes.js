const express = require('express');
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost } = require('../controllers/posts');
const { requireSignin } = require('../controllers/auths');
const { userById } = require('../controllers/users');
const { createPostValidator } = require('../helpers/validator');

const router = express.Router();

router.get('/posts', getPosts);
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/posts/:userId', postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// Will execute userById first for any route containing :userId
router.param('userId', userById);
// Will execute postById first for any route containing :postId
router.param('postId', postById);

module.exports = router;