const _ = require('lodash');
const User = require('../models/User');
const formidable = require('formidable');
const fs = require('fs'); // file system

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        req.profile = user // Add profile object in req
        next();
    })
}

exports.hasAuthorization = (req, res) => {
    const authorized = req.profile && req.auth && req.profile._id === req._id;
    if (!authorized) {
        return res.status(403).json({
            error: 'Unauthorized'
        })
    }
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(users)
    })
        .select('name email updated createdAt');
}

exports.getUser = (req, res) => {
    // Set to undefined so they do not appear in the result
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    // Return req.profile because of userById method (also refer user routes)
    return res.json(req.profile);
}

exports.updateUser = (req, res) => {
    let user = req.profile;
    // _ is lodash (lodash has several built in methods for js)
    // extend mutates the source object (req.body mutates user)
    user = _.extend(user, req.body)
    // Add the 'updatedAt' property to the user document
    user.updatedAt = Date.now();
    user.save(err => {
        if (err) {
            return res.status(400).json({
                error: 'Unauthorized'
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.status(200).json({ user })
    });
}

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            })
        }
        // User info gets saved in req.profile from user ID in URL
        let user = req.profile
        user = _.extend(user, fields)
        user.updatedAt = Date.now()

        // If there is a photo, update user data
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            // Undefined will not affect values in db
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        })
    })
}

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next();
}

exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            message: `${deletedUser.name} deleted successfully`
        })
    });
}