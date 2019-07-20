const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');
const User = mongoose.model('User');

var postSchema = new mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    title: String,
    description: String,
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

postSchema.plugin(uniqueValidator, { message: 'is already taken' });

// Model method to generate a unique URL slug for each post
postSchema.methods.slugify = function() {
    this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

// Invoking above model method to create the URL slug prior to Mogoose validating the model
postSchema.pre('validate', function(next) {
    if (!this.slug) {
        this.slugify();
    }

    next();
});

// Model method to return JSON of article
postSchema.methods.toJSONFor = function(user) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tag_list: this.tag_list,
        author: this.author.toProfileJSONFor(user)
    };
};

mongoose.model('Post', postSchema);