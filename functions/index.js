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
  const { lowBPM, highBPM } = data;
  return questionsRef
    .where('bpm', '>=', lowBPM)
    .where('bpm', '<=', highBPM)
    .orderBy('bpm', 'desc')
    .orderBy('uploadedAt', 'desc')
    .limit(10).get().then(
    (querySnapshot) => {
      return Promise.all(
        querySnapshot.docs.map(item => {
          // TODO: fix lint(どうやって直せば良いのか・・・)
          return admin.auth().getUser(item.data().uid).then(userRecord => {
            const data = item.data()
            data.userName = userRecord.displayName;
            return {id: item.id, data};
          })
        })
      )
    }
  );
})

exports.uploadQuestion = functions.https.onCall((data, context) => {
  data.uploadedAt = admin.firestore.FieldValue.serverTimestamp()
  return questionsRef.add(data).then(() => {
    return { errState: 0 };
  })
})
