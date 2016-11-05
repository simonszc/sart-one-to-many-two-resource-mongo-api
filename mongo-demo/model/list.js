'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');

const Note = require('./note.js');

const listSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  notes: [{type: Schema.Types.ObjectId, ref: 'note'}]
});

const List = module.exports = mongoose.model('list', listSchema);

List.findByIdAndAddNote = function(id, note) {
  return List.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(list => {
    //create a note and update list
    note.listID = list._id;
    this.tempList = list;
    return new Note(note).save()
  })
  .then( _note => {
    this.tempList.notes.push(_note._id);
    this.tempNote = _note;
    return this.tempList.save();
  })
  .then( () => {
    return this.tempNote;
  });
};

List.findByIdAndRemoveNoteById = function(listID, noteID) {
  return List.findById(listID)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(list => {
    //delete the note from the list
    this.tempList = list;
    return list.notes.filter( _noteID => {
      return noteID.toString() !== _noteID.toString()
    });
  })
  .then(notes => {
    this.tempList.notes = notes;
    return this.tempList.save()
  })
}
