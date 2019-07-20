const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }
}, {
    timestamps: true
});

// Model method to return JSON of comment
commentSchema.methods.toJSONFor = function(user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};


mongoose.model('Comment', commentSchema);