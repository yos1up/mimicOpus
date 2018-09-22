"use strict";
import actionTypes from "./actionTypes";

// Notes
export const clearNotes = function(){
  return {
    type: actionTypes.CLEAR_NOTES,
  };
};
export const addNote = function(note){
  return {
    type: actionTypes.ADD_NOTE,
    note: note,
  };
};
export const delNote = function(idx){
  return {
    type: actionTypes.DEL_NOTE,
    idx: idx,
  };
};
