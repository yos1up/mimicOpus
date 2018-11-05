const express = require('express');
const bodyParser = require('body-parser'); // body-parser

const api = require('./api');
const auth = require('./auth');

const app = express();

function forceHttps(req, res, next) {
  if (!process.env.PORT) {
    next();
  } else if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
}

app.all('*', forceHttps);

app.set('port', (process.env.PORT || 8080));

app.use(express.static('dist'));
app.use(express.static('public'));

app.use('/', auth);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', api);

app.listen(app.get('port'), () => console.log('Listening on port!'));
