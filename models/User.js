const mongoose = require('mongoose');
const uuidv1 = require('uuidv1');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
})

/*
   * Virtual fields are additional fields for a given model.
   * Their values can be set manually or automatically with defined functionality.
   * Virtual properties don't get persisted in the database.
   * They only exist logically and are not written to the document's collection.
*/

userSchema.virtual('password')
    .set(function(password) {
        // Create temp password called _password
        this._password = password
        // Generate timestamp
        this.salt = uuidv1()
        // Set hashed password as password value in collection
        this.hashed_password = this.encryptPassword(password)
    })
    .get(() => {
        return this._password
    })

    // Can add arbritrary number of methods
userSchema.methods = {
    authenticate: function(plainText) {
        // Compare user entered password with hashed password
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            // Crypto is build into node for hashing
            return crypto.createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
        } catch (err) {
            return '';
        }
    }
}

module.exports = mongoose.model('User', userSchema);