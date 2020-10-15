const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user.model');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        let user = await User.findOne({ where: { email: email } });
        if (!user)
            return done(null, false, { message: 'Incorrect email or password.' });
        return done(null, user, { message: 'Logged in successfully.' });
    } catch (err) {
        done(err);
    };

}));

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser((userid, done) => {
    User.findOne({ where: { userid: userid } })
        .then(user => {
            // console.log('user', user);
            done(null, user);
        }).catch(err => done(err));
})
