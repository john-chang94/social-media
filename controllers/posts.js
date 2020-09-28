const _ = require('lodash');
const Post = require("../models/Post");
const formidable = require('formidable');
const fs = require('fs'); // file system

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                })
            }
            req.post = post; // Add post object in req (similar to userById)
            next();
        })
}

exports.getPosts = (req, res) => {
    Post.find()
        // Use populate becuase the Post model refers the postedBy by the User object model
        // Otherwise, it will only return the user id
        .populate('postedBy', '_id name') // ([property name to grab], [which properties to select in prop name])
        .sort({ createdAt: -1 })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => console.log(err));
}

exports.createPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'File upload error'
            })
        }
        let post = new Post(fields);
        // Remove password info before assigning user to postedBy
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.status(200).json(result);
        })
    })
}

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .sort('_created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(posts);
        })
}

exports.isPoster = (req, res, next) => {
    // Check if the postedBy id matches the user trying to delete
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id; // truthy because comparing non-string ids
    if (!isPoster) {
        return res.status(403).json({
            error: 'Unauthorized'
        })
    }
    next();
}

exports.updatePost = (req, res) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updatedAt = Date.now();
    post.save((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(post);
    })
}

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            })
        }
        // Post info gets saved in req.post from post ID in URL
        let post = req.post;
        post = _.extend(post, fields)
        post.updatedAt = Date.now()

        // If there is a photo, update post data
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(post);
        })
    })
}

exports.deletePost = (req, res) => {
    let post = req.post // Grabbing from postById method
    post.remove((err, deletePost) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: 'Post deleted successfully'
        })
    })

}

exports.postPhoto = (req, res) => {
    // Set photo type grabbed from req (jpg, png, etc)
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
}

exports.loadPost = (req, res) => {
    return res.json(req.post);
}