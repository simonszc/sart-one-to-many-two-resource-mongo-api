'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const List = require('../model/list.js');
const Note = require('../model/note.js');

const noteRouter = module.exports = new Router;

noteRouter.post('/api/list/:listID/note', jsonParser, function(req, res, next) {
  List.findByIdAndAddNote(req.params.listID, req.body)
  .then( note => {
    res.json(note);
  })
  .catch(next);
});

noteRouter.get('/api/list/:listID/note/:noteID', jsonParser, function(req, res,next) {
  Note.findOne({_id: req.params.noteID})
  .then ( note => {
    res.json(note);
  })
  .catch(next);
});

noteRouter.put('/api/list/:listID/note/:noteID', jsonParser, function(req, res, next) {
  Note.findByIdAndUpdate(req.params.noteID, req.body, {new: true})
  .then( note => res.json(note))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

noteRouter.delete('/api/list/:listID/note/:noteID', function(req, res, next) {
  Promise.all([
    List.findByIdAndRemoveNoteById(req.params.listID, req.params.noteID),
    Note.findByIdAndRemove(req.params.noteID)
  ])
  .then( results => res.json(results))
  .catch(err => next(createError(404, err.message)))
})
