const jwt = require('jsonwebtoken');
require('dotenv').config();
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