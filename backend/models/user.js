const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

require('dotenv').config();

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email cannot be blank"],
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
        unique: true,
        trim: true,
        index: true
    },
    first_name: {
        type: String,
        required: [true, "First name cannot be blank"],
        trim: true,
        match: [/^[a-zA-Z]*$/, 'Name is invalid']
    },
    last_name: {
        type: String,
        required: [true, "Last name cannot be blank"],
        trim: true,
        match: [/^[a-zA-Z]*$/, 'Name is invalid']
    },
    affiliate_list: [{ type: String }],
    bio: String,
    is_mentor: {
        type: Boolean,
        required: [true, "Cannot be left blank (true/false)"]
    },
    tag_list: [{ type: String }],
    image: String,
    hash: String,
    salt: String
}, {
    timestamps: true,
})

// Plugin used to validate unique field
userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

// Helper method for user model to salt and hash passwords using
// crypto library
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// Helper method for user model to validate password
userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

// Helper method for user model to generate a JWT
userSchema.methods.generateJWT = function() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

// Helper method to get JSON rep of user for auth
userSchema.methods.toAuthJSON = function() {
    return {
        email: this.email,
        token: this.generateJWT(),
        first_name: this.first_name,
        last_name: this.last_name,
        affiliate_list: this.affiliate_list,
        is_mentor: this.is_mentor,
        tag_list: this.tag_list,
        bio: this.bio,
        image: this.image
    };
};

// Helper method to return public profile data
userSchema.methods.toProfileJSONFor = function(user) {
    return {
        first_name: this.first_name,
        last_name: this.last_name,
        affiliate_list: this.affiliate_list,
        is_mentor: this.is_mentor,
        tag_list: this.tag_list,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
    };
};

const User = mongoose.model('User', userSchema);

module.exports = User;