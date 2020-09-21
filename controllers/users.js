const _ = require('lodash');
const User = require('../models/User');
const formidable = require('formidable');
const fs = require('fs'); // file system

exports.userById = (req, res, next, id) => {
    User.findById(id)
        // Populate followers/following array
        // Otherwise, we would only get the user ID
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
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

exports.addFollowing = (req, res, next) => {
    // The user found in this method is adding the following user to their following list
    User.findByIdAndUpdate(req.body.userId,
        { $push: { following: req.body.followId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            next();
        })
}

exports.addFollower = async (req, res) => {
    // The user that has been added in above method is getting their followers list updated
    let doc = await User.findByIdAndUpdate(req.body.followId,
        { $push: { followers: req.body.userId } },
        { new: true }, // Return updated object
    )

    // Different code from tut because the returned data
    // was only a user Id in the followers array.
    // The returned followers array must have a user object
    // for the follow check function to work from frontend
    User.findById(req.body.followId)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(user)
        })
}

exports.removeFollowing = (req, res, next) => {
    // The user found in this method is adding the following user to their following list
    User.findByIdAndUpdate(req.body.userId,
        { $pull: { following: req.body.unfollowId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            next();
        })
}

exports.removeFollower = (req, res) => {
    // The user that has been added in above method is getting their followers list updated
    User.findByIdAndUpdate(req.body.unfollowId,
        { $pull: { followers: req.body.userId } },
        { new: true }, // Return updated object
    )
        .populate('following', '_id name')
        .populate('follwers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        })
}

// Suggest others to follow that the user is not already following
exports.findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    // nin - not including
    User.find({ _id: { $nin: following } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(users);
    }).select('name');
}