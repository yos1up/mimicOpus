const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.questionsList = functions.https.onRequest((request, response) => {
  const questionsRef = admin.firestore().collection('questions');
  questionsRef.orderBy('uploadedAt', 'desc').limit(10).get().then(
    (querySnapshot) => {
      response.send(querySnapshot.docs.map(item => item.data()));
      return 0;
    }
  ).catch(reason => {
      res.send(reason)
  });
})
