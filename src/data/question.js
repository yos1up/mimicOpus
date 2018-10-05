import Immutable from 'immutable';
import firebase from 'firebase';

import Note from './note';

class Question extends Immutable.Record({
  notes: Immutable.List(),
  bpm: 120,
  uid: '',
  uploadedAt: null,
}) {
  static fromJS(obj) {
    let { notes } = obj;
    notes.map(item => new Note(item));
    notes = Immutable.List(notes);
    // TODO: fix
    const uploadAt = new firebase.firestore.Timestamp(obj.uploadedAt._seconds, obj.uploadedAt._nanoseconds);
    return new Question({
      notes,
      bpm: obj.bpm,
      uid: obj.uid,
      uploadedAt: uploadAt,
    });
  }
}

export default Question;
