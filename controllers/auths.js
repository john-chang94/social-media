const _ = require('lodash');
const { sendEmail } = require('../helpers/mailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/User');

exports.signUp = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) return res.status(403).json({
        error: 'Email already exists'
    })

    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Sign up success!' })
}

exports.signIn = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: 'Email does not exist'
            })
        }
        // authenticate is a method we build in User model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        const { _id, name, email } = user;
        return res.status(200).json({
            token,
            user: { _id, name, email }
        })
    })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // Find the user based on email
    User.findOne({ email }, (err, user) => {
        // If err or no user
        if (err || !user)
            return res.status('401').json({
                error: 'Email does not exist'
            });

        // Generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: 'NODEAPI' },
            process.env.JWT_SECRET
        );

        // Email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL
                }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // If err or no user
        if (err || !user)
            return res.status('401').json({
                error: 'Invalid Link!'
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updatedAt = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: 'Great! Now you can sign in with your new password.'
            });
        });
    });
};