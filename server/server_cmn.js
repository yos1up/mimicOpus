const bodyParser = require('body-parser') // body-parser
const { Client } = require('pg')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");

const databaseURL = process.env.DATABASE_URL || 'postgresql://mimicopus:mimicopus@127.0.0.1:5432/mimicopus';

const client = new Client({
  connectionString: databaseURL,
})
client.connect()

const uploadQuestion = (req, res) => {
  const data = req.body
  const query = {
    text: 'INSERT INTO questions(notes, bpm, uid, userName, title, uploadedAt) VALUES($1, $2, $3, $4, $5, $6)',
    values: [JSON.stringify(data.notes), data.bpm, data.uid, data.userName, data.title, new Date()],
  }

  client.query(query)
    .then(result => res.send({ errState: 0 }))
    .catch(e => {
      console.log(e);
      res.send({ errState: 1 });
    });
}

const loadQuestionsList = (req, res) => {
  if(req.isAuthenticated()){
    console.log(req.user.displayName);
  }
  const urlQuery = req.query;
  if (urlQuery.lowBPM === null || urlQuery.lowBPM === undefined) {
    urlQuery.lowBPM = 60;
  }
  if (urlQuery.highBPM === null || urlQuery.highBPM === undefined) {
    urlQuery.highBPM = 200;
  }
  const query = {
    text: 'SELECT * FROM questions where BPM >= $1 and BPM <= $2 ORDER BY uploadedAt',
    values: [urlQuery.lowBPM, urlQuery.highBPM],
  }

  client.query(query)
    .then(result => {
      const returnData = {}
      result.rows.forEach(item => {
        returnData[item.id] = {
          notes: item.notes,
          bpm: item.bpm,
          uid: item.uid,
          userName: item.username,
          title: item.title,
          uploadedAt: item.uploadedat,
        };
      })
      res.send(returnData);
      return;
    })
    .catch(e => {
      console.log(e);
      res.send(result);
    });
}

const saveScore = (req, res) => {
  const data = req.body;
  const query = {
    text: 'INSERT INTO scores(qid, uid, score) VALUES($1, $2, $3)',
    values: [data.qid, data.uid, data.score],
  }

  client.query(query)
    .then(result => res.send({ errState: 0 }))
    .catch(e => {
      console.log(e);
      res.send({ errState: 1 });
    });
}

exports.server_cmn = (app) => {
  passport.use(new GoogleStrategy({
        clientID: process.env.MIMICOPUS_GOOGLE_CLIENT_ID,
        clientSecret: process.env.MIMICOPUS_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback"
    }, ((accessToken, refreshToken, profile, done) => {
      if (profile) {
          return done(null, profile);
      }
      else {
          return done(null, false);
      }
    })
  ));
  passport.serializeUser((id, done) => {
      done(null, id);
  });

  passport.deserializeUser((id, done) => {
      done(null, id);
  });

  app.use(session({ secret: "some salt", resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }));
  app.get('/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/uploadQuestion', uploadQuestion);
  app.get('/loadQuestionsList', loadQuestionsList);
  app.post('/saveScore', saveScore);
}
