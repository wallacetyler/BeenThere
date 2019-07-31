const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');
const auth = require('../auth');

// Router URL parameter middleware for finding the post by the slug specified in URL
// and set it to req.post for other routes to use
router.param('post', function(req, res, next, slug) {
    Post.findOne({ slug: slug.toString() })
        .populate('author')
        .then(function(post) {
            if (!post) {
                return res.sendStatus(401);
            }
            
            req.post = post;

            return next();
        }).catch(next);
});

// Router URL parameter middleware for finding a comment by the ID specified in URL
// and set it to 'req.comment' for other routes to use
router.param('comment', function(req, res, next, id) {
    Comment.findById(id).then(function(comment) {
        if (!comment) {
            return res.sendStatus(404);
        }

        req.comment = comment;

        return next();
    }).catch(next);
});

// Route to list all posts
router.get('/', auth.optional, function(req, res, next) {
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    if (typeof req.query.tag !== 'undefined') {
        query.tag_list = {"$in": [req.query.tag]};
    }

    // Allow ability to filter by author
    Promise.all([
        req.query.author ? User.findOne({ _id: req.query.author }) : null
    ]).then(function(results) {
        var author = results[0];
        
        if (author) {
            query.author = author._id;
        }
    }); 

    return Promise.all([
        Post.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc'})
            .populate('author')
            .exec(),
        Post.count(query).exec(),
        req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results) {
        var posts = results[0];
        var postsCount = results[1];
        var user = results[2];


        return res.json({
            posts: posts.map(function(post) {
                return post.toJSONFor(user);
            }),
            postsCount: postsCount
        });
    }).catch(next);
});

// // Route for feed of posts
// router.get('/feed', auth.required, function(req, res, next) {
//     var limit = 20;
//     var offset = 0;

//     if (typeof req.query.limit !== 'undefined') {
//         limit = req.query.limit
//     }

//     if (typeof req.query.offset !== 'undefined') {
//         offset = req.query.offset;
//     }

//     User.findById(req.payload.id).then(function(user) {
//         if (!user) {
//             return res.sendStatus(401);
//         }

//         Promise.all([
//             Post.find({})
//         ])
//     })
// })

// Route to create post
router.post('/', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
 
        var post = new Post(req.body.post);

        post.author = user;

        return post.save().then(function() {
            return res.json({
                post: post.toJSONFor(user)
            });
        });
    }).catch(next);
});

// Route to read posts
router.get('/:post', auth.optional, function(req, res, next) {
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.post.populate('authod').execPopulate()
    ]).then(function(results) {
        var user = results[0];

        return res.json({
            post: req.post.toJSONFor(user)
        });
    }).catch(next);
});

// Route to update posts
router.put('/:post', auth.required, function(req, res, next) {
			//console.log(req.post);
			console.log(req.body);
    User.findById(req.payload.id).then(function(user) {
        if (req.post.author._id.toString() === req.payload.id.toString()) {
		
            if (typeof req.body.post.title !== 'undefined') {
                req.post.title = req.body.post.title;
            }

            if (typeof req.body.post.description !== 'undefined') {
                req.post.description = req.body.post.description;
            }

            if (typeof req.body.post.body !== 'undefined') {
                req.post.body = req.body.post.body;
            }

            req.post.save().then(function(post) {
                return res.json({
                    post: post.toJSONFor(user) 
                });
            })
        }
        else {
            return res.sendStatus(403);
        }
    });
});

// Route to delete posts
router.delete('/:post', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function() {
        if (req.post.author._id.toString() === req.payload.id.toString()) {
            return req.post.remove().then(function() {
                return res.sendStatus(204);
            });
        }
        else {
            return res.sendStatus(403);
        }
    });
});

// Route to create comments
router.post('/:post/comments', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }

        var comment = new Comment(req.body.comment);
        comment.post = req.post;
        comment.author = user;

        return comment.save().then(function() {
            req.post.comments.push(comment);

            return req.post.save().then(function(post) {
                res.json({
                    comment: comment.toJSONFor(user)
                });
            });
        });
    }).catch(next);
});


// Route to list comments on a particular post
router.get('/:post/comments', auth.optional, function(req, res, next) {
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user) {
        return req.post.populate({
            path: 'comments',
            populate: {
                path: 'author'
            },
            options: {
                sort: {
                    createdAt: 'desc'
                }
            }
        }).execPopulate().then(function(post) {
            return res.json({
                comments: req.post.comments.map(function(comment) {
                    return comment.toJSONFor(user);
                })
            });
        });
    }).catch(next);
});

// Route to delete specific comment by comment ID
router.delete('/:post/comments/:comment', auth.required, function(req, res, next) {
    if (req.comment.author.toString() === req.payload.id.toString()) {
        req.post.comments.remove(req.comment._id);
        req.post.save()
            .then(Comment.find({ _id: req.comment._id }).remove().exec())
            .then(function() {
                res.sendStatus(204);
            });
    }
    else {
        res.sendStatus(403);
    }
});

module.exports = router;