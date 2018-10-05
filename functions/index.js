const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore()
firestore.settings({ timestampsInSnapshots: true });
const questionsRef = firestore.collection('questions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.questionsList = functions.https.onCall((data, context) => {
  return questionsRef.orderBy('uploadedAt', 'desc').limit(10).get().then(
    (querySnapshot) => {
      return querySnapshot.docs.map(
        item => ({id: item.id, data: item.data()})
      );
    }
  );
})

exports.uploadQuestion = functions.https.onCall((data, context) => {
  return questionsRef.add(data).then(() => {
    return { errState: 0 };
  })
})
