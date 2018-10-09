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

const loadQuestionsList = (req, res) => {
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

exports.server_cmn = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/uploadQuestion', uploadQuestion);
  app.get('/loadQuestionsList', loadQuestionsList);
}
