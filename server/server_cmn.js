const bodyParser = require('body-parser') // body-parser
const { Client } = require('pg')

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

exports.server_cmn = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/test', (req, res) => res.send({ test: "test" }));

  app.post('/uploadQuestion', uploadQuestion);
}
