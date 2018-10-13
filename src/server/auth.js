const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const authRouter = express.Router();


passport.use(new GoogleStrategy({
  clientID: process.env.MIMICOPUS_GOOGLE_CLIENT_ID,
  clientSecret: process.env.MIMICOPUS_GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, ((accessToken, refreshToken, profile, done) => {
  if (profile) {
    console.log(profile);
    return done(null, profile);
  }
  return done(null, false);
})));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

authRouter.use(session({ secret: 'some salt', resave: true, saveUninitialized: true }));
authRouter.use(passport.initialize());
authRouter.use(passport.session());
authRouter.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}));
authRouter.get('/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/');
  });

module.exports = authRouter;
