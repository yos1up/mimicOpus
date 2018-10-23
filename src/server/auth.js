const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DummyStrategy = require('passport-dummy').Strategy;
const session = require('express-session');

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
passport.use(new DummyStrategy(
  (done) => {
    done(null, 'anonymous');
  }
));

passport.serializeUser((user, done) => {
  let query;
  if (user === 'anonymous') {
    query = {
      text: 'INSERT INTO users(provider, idByProvider, username, photoURL, totalscore, rating) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: ['anonymous', '', 'anonymous', '', 0, null],
    };
    client.query(query)
      .then((result2) => {
        done(null, result2.rows[0].id);
      });
  } else {
    query = {
      text: 'SELECT * FROM users where provider = $1 and idByProvider = $2',
      values: [user.provider, user.id],
    };
    client.query(query)
      .then((result) => {
        if (result.rows.length === 0) {
          query = {
            text: 'INSERT INTO users(provider, idByProvider, username, photoURL, totalscore, rating) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [user.provider, user.id, 'anonymous', user.photos[0].value, 0, null],
          };
          client.query(query)
            .then((result2) => {
              done(null, result2.rows[0].id);
            });
        } else {
          done(null, result.rows[0].id);
        }
      });
  }
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
        username: row.username,
        photoURL: row.photourl,
        provider: row.provider,
        rating: row.rating,
      });
    });
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
authRouter.get('/auth/anonymous',
  passport.authenticate('dummy'),
  (req, res) => {
    res.send({});
  });
authRouter.get('/auth/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = authRouter;
