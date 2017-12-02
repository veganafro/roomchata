const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
