const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 150
    },
    body: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 2000
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedAt: Date,
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: String,
        createdAt: { type: Date, default: Date.now() },
        postedBy: { type: ObjectId, ref: 'User' }
    }]
})

module.exports = mongoose.model('Post', postSchema);