import Immutable from 'immutable';

import Note from './note';

class Question extends Immutable.Record({
  notes: Immutable.List(),
  bpm: 120,
  uid: '',
  displayName: '',
  title: '',
  rating: 0,
  uploadedAt: null,
  score: null,
}) {
  static fromJS(obj) {
    let { notes } = obj;
    const newObj = obj;
    notes.map(item => new Note(item));
    notes = Immutable.List(notes);
    newObj.notes = notes;
    newObj.uploadedAt = new Date(obj.uploadedAt);
    return new Question(newObj);
  }
}

export default Question;
