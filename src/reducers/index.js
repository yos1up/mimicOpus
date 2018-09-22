import actionTypes from "../actions/actionTypes";
import Immutable from "immutable";

export default function(state = {notes: Immutable.List()}, action){
  switch (action.type) {
  case actionTypes.CLEAR_NOTES:
    return {notes: Immutable.List()};

  case actionTypes.ADD_NOTE:
    return {notes: state.notes.push(action.note)};

  case actionTypes.DEL_NOTE:
    return {notes: state.notes.delete(action.idx)};

  default:
    return state;
  }
};
