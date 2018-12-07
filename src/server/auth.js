const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const session = require('express-session');
const connectPg = require('connect-pg-simple');

const client = require('./pgClient');

const authRouter = express.Router();


passport.use(new GoogleStrategy({
  clientID: process.env.MIMICOPUS_GOOGLE_CLIENT_ID,
  clientSecret: process.env.MIMICOPUS_GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.MIMICOPUS_GOOGLE_CALLBACK,
}, ((accessToken, refreshToken, profile, done) => {
  if (profile) {
    return done(null, profile);
  }
  return done(null, false);
})));

passport.use(new GooglePlusTokenStrategy({
  clientID: process.env.MIMICOPUS_GOOGLE_CLIENT_ID,
  clientSecret: process.env.MIMICOPUS_GOOGLE_CLIENT_SECRET,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (profile) {
    console.log(profile);
    return done(null, profile);
  }
  return done(null, false);
}));

passport.serializeUser((user, done) => {
  let query;
  let { provider } = user;
  if (provider === 'google-plus') {
    provider = 'google';
  }
  query = {
    text: 'SELECT * FROM users where provider = $1 and idByProvider = $2',
    values: [provider, user.id],
  };
  client.query(query)
    .then((result) => {
      if (result.rows.length === 0) {
        query = {
          text: 'INSERT INTO users(provider, idByProvider, displayName, photoURL, totalscore, rating) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
          values: [provider, user.id, user.displayName, user.photos[0].value, 0, null],
        };
        client.query(query)
          .then((result2) => {
            done(null, result2.rows[0].id);
          });
      } else {
        done(null, result.rows[0].id);
      }
    });
});

passport.deserializeUser((id, done) => {
  const query = {
    text: 'SELECT * FROM users where id = $1 ',
    values: [id],
  };
  client.query(query)
    .then((result) => {
      const row = result.rows[0];
      done(null, {
        id: row.id,
        displayName: row.displayname,
        photoURL: row.photourl,
        provider: row.provider,
        rating: row.rating,
      });
    });
});

const databaseURL = process.env.DATABASE_URL || 'postgresql://mimicopus:mimicopus@127.0.0.1:5432/mimicopus';
authRouter.use(session({
  store: new (connectPg(session))({
    conString: databaseURL,
    tableName: 'session'
  }),
  secret: 'some salt',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

authRouter.use(passport.initialize());
authRouter.use(passport.session());
authRouter.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}));
authRouter.get('/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    const ua = req.header('user-agent');
    if (/mobile/i.test(ua)) {
      res.redirect('mimicopus://');
    } else {
      res.redirect('/');
    }
  });
authRouter.get('/auth/logout',
  (req, res) => {
    req.logout();

    const ua = req.header('user-agent');
    if (/mobile/i.test(ua)) {
      res.redirect('mimicopus://');
    } else {
      res.redirect('/');
    }
  });

authRouter.get('/auth/google/token',
  passport.authenticate('google-plus-token'),
  (req, res) => {
    res.send(req.user);
  });

module.exports = authRouter;
