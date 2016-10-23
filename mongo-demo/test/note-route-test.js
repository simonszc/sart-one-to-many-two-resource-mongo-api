'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGOLAB_URI = 'mongodb://localhost/notetest';

const expect = require('chai').expect;
const request = require('superagent');
const Note = require('../model/note.js');
const List = require('../model/list.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleNote = {
  name: 'lulwat',
  content: 'hello world'
};
const exampleList = {
  name: 'lulwat',
  timestamp: new Date()
};
const updateNote = {
  name: 'constantine'
}


describe('testing note routes', function() {
  describe('testing POST requests', function() {
    describe('with valid list id and noteBody', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        Promise.all([
          List.remove({}),
          Note.remove({})
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a note', (done) => {
        request.post(`${url}/api/list/${this.tempList.id}/note`)
        .send(exampleNote)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleNote.name);
          expect(res.body.listID).to.equal(this.tempList._id.toString());
          done();
        });
      });
    });
  });
  describe('testing GET requests', function() {
    describe('with valid list id and noteBody', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
        })
        .then( () => {
          exampleNote.listID = this.tempList._id;
          new Note(exampleNote).save()
          .then( note => {
            this.tempNote = note;
            done();
          })
          .catch(done);
        })
        .catch(done);
      });
      after( done => {
        Promise.all([
          List.remove({}),
          Note.remove({})
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a note', (done) => {
        request.get(`${url}/api/list/${this.tempList.id}/note/${this.tempNote.id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleNote.name);
          expect(res.body.listID).to.equal(this.tempList._id.toString());
          expect(res.body._id).to.equal(this.tempNote._id.toString());
          done();
        });
      });
    });
  });
  describe('testing PUT requests', function() {
    describe('with valid list id and noteBody', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
        })
        .then( () => {
          exampleNote.listID = this.tempList._id;
          new Note(exampleNote).save()
          .then( note => {
            this.tempNote = note;
            done();
          })
          .catch(done);
        })
        .catch(done);
      });
      after( done => {
        Promise.all([
          List.remove({}),
          Note.remove({})
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a note', (done) => {
        request.put(`${url}/api/list/${this.tempList.id}/note/${this.tempNote.id}`)
        .send(updateNote)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(updateNote.name);
          expect(res.body.content).to.equal(exampleNote.content);
          expect(res.body.listID).to.equal(this.tempList._id.toString());
          expect(res.body._id).to.equal(this.tempNote._id.toString());
          done();
        });
      });
    });
  });
});
