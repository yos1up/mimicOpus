const express = require('express');
const bodyParser = require('body-parser'); // body-parser

const api = require('./api');
const auth = require('./auth');

const app = express();

app.use(express.static('dist'));
app.use(express.static('public'));

app.use('/', auth);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', api);

app.listen(8080, () => console.log('Listening on port 8080!'));
