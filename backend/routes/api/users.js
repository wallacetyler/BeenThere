const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth')

// Registration route
router.post('/users', function(req, res, next) {
    const user = new User();

    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);
    user.first_name = req.body.user.first_name;
    user.last_name = req.body.user.last_name;
    
    if (typeof req.body.user.affiliate_list !== 'undefined') {
        console.log('Setting affiliate_list');
        user.affiliate_list = req.body.user.affiliate_list;
    }
    
    if (typeof req.body.user.bio !== 'undefined') {
        user.bio = req.body.user.bio;
    }

    if (typeof req.body.user.is_mentor !== 'undefined') {
        user.is_mentor = req.body.user.is_mentor;
    }

    if (typeof req.body.user.tag_list !== 'undefined') {
        user.tag_list = req.body.user.tag_list;
    }

    user.save().then(function() {
        return res.json({ user: user.toAuthJSON()});
    }).catch(next);
});

// Login route
router.post('/users/login', function(req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({
            errors: { email: "Cannot be blank" }
        });
    }

    if (!req.body.user.password) {
        return res.status(422).json({
            errors: { password: "Cannot be blank" }
        });
    }

    // Use local strategy (in config/passport.js), 'session: false' to not use session auth
    // (since we are using JWTs), define callback func to use as done() in 'config/passport.js'
    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON()});
        } 
        else {
            return res.status(422).json(info);
        }
    }) (req, res, next);
});
                                                                                                                            
// Endpoint to get current user's auth payload from their token
router.get('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }

        return res.json({ user: user.toAuthJSON() }); 
    }).catch(next);
});

// Endpoint to update user
router.put('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        };

        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }

        if (typeof req.body.user.first_name !== 'undefined') {
            user.first_name = req.body.user.first_name;
        }

        if (typeof req.body.user.last_name !== 'undefined') {
            user.last_name = req.body.user.last_name;
        }

        if (typeof req.body.user.affiliate_list !== 'undefined') {
            user.affiliate_list = req.body.user.affiliate_list;
        }

        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }

        if (typeof req.body.user.is_mentor !== 'undefined') {
            user.is_mentor = req.body.user.is_mentor;
        }

        if (typeof req.body.user.tag_list !== 'undefined') {
            user.tag_list = req.body.user.tag_list;
        }

        return user.save().then(function() {
            return res.json({ user: user.toAuthJSON() });
        });
    }).catch(next);
});

// Route to get all mentors
router.get('/mentors', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
        
        var query = { is_mentor: true };
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
    
        return Promise.all([
            User.find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc'})
                .exec(),
            User.count(query).exec(),
            req.payload ? User.findById(req.payload.id) : null,
        ]).then(function(results) {
            var mentors = results[0];
            var mentorsCount = results[1];
            var user = results[2];
    
            return res.json({
                mentors: mentors.map(function(mentor) {
                    return mentor.toProfileJSONFor(user);
                }),
                mentorsCount: mentorsCount
            });
        }).catch(next);
    }).catch(next);
});

module.exports = router;