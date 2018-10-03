import Immutable from 'immutable';

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
    return new Question({
      notes,
      bpm: obj.bpm,
      uid: obj.uid,
      uploadedAt: obj.uploadedAt,
    });
  }
}

export default Question;
