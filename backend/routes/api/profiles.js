const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../auth');

// Router URL parameter middleware for finding the user by ID specified in URL
// and set it to req.profile for use by other routes
router.param('id', function(req, res, next, user) {
    User.findById(req.params.id).then(function(user) {
        if (!user) {
            return res.sendStatus(404);
        }

        req.profile = user;

        return next();
    }).catch(next);
});

// Route to return profile
router.get('/:id', auth.optional, function(req, res, next) {
    if(req.payload) {
        User.findById(req.payload.id).then(function(user) {
            if (!user) {
                // No user returned from 'payload.id'
                return res.json({ profile: req.profile.toProfileJSONFor(false) });
            } 
            
            return res.json({ profile: req.profile.toProfileJSONFor() });
        });
    } else {
        // No user logged in
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
    }
});

module.exports = router;