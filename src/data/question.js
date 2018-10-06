import Immutable from 'immutable';
import firebase from 'firebase';

import Note from './note';

class Question extends Immutable.Record({
  notes: Immutable.List(),
  bpm: 120,
  uid: '',
  userName: '',
  name: '',
  uploadedAt: null,
}) {
  static fromJS(obj) {
    let { notes } = obj;
    const newObj = obj;
    notes.map(item => new Note(item));
    notes = Immutable.List(notes);
    newObj.notes = notes;
    // TODO fix lint
    const uploadedAt = new firebase.firestore.Timestamp(
      obj.uploadedAt._seconds, obj.uploadedAt._nanoseconds,
    );
    newObj.uploadedAt = uploadedAt;
    return new Question(newObj);
  }
}

export default Question;
