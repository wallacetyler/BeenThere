const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');


// Configure Passport, an auth system made for Node.js, to auth with JWT's
// instead of default session auth 
passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function (email, password, done) {
    User.findOne({email: email}).then(function(user) {
        if(!user || !user.validPassword(password)) {
            return done(
                null,
                false,
                {errors: {'email or password': 'is invalid'}}
            );
        }

        return done(null, user);
    }).catch(done);
}));