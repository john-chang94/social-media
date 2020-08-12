const Post = require("../models/Post");
const formidable = require('formidable');
const fs = require('fs'); // file system

exports.getPosts = (req, res) => {
    Post.find()
        // .select('_id title body')
        .then(posts => {
            res.status(200).json({
                posts
            })
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