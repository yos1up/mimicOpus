const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const questionsRef = admin.firestore().collection('questions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.questionsList = functions.https.onCall((data, context) => {
  return questionsRef.orderBy('uploadedAt', 'desc').limit(10).get().then(
    (querySnapshot) => {
      return {questionsList: querySnapshot.docs.map(
        item => ({id: item.id, data: item.data()})
      )};
    }
  );
})
