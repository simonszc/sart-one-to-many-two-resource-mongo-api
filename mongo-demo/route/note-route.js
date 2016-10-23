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
