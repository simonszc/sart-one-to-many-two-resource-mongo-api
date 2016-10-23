'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGOLAB_URI = 'mongodb://localhost/notetest';

const expect = require('chai').expect;
const request = require('superagent');
const List = require('../model/list.js');
const Note = require('../model/note.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleList = {
  name: 'lulwat',
  timestamp: new Date()
};

const exampleNote = {
  name: 'lulwat',
  content: 'haha'
};

describe('testing route /api/list', function() {
  describe('testing POST requests', function() {
    describe('with valid body', function() {
      after( done => {
        if(this.tempList) {
          List.remove({})
          .then(() => done())
          .catch(done)
          return;
        }
        done();
      });
      it('should return a list', (done) => {
        request.post(`${url}/api/list`)
        .send(exampleList)
        .end((err, res)=>{
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('lulwat');
          this.tempList = res.body;
          done();
        });
      });
    });
  });
  describe('testing GET requests', function() {
    describe('with valid body', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          return List.findByIdAndAddNote(list._id, exampleNote);
        })
        .then( note => {
          this.tempNote = note;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempList) {
          List.remove({})
          .then(() => done())
          .catch(done)
          return;
        }
        done();
      });
      it('should return a list', (done) => {
        request.get(`${url}/api/list/${this.tempList._id}`)
        .send(exampleList)
        .end((err, res)=>{
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('lulwat');
          expect(res.body.notes.length).to.equal(1);
          expect(res.body.notes[0].name).to.equal(exampleNote.name);
          this.tempList = res.body;
          done();
        });
      });
    });
  });
  describe('testing PUT requests', function() {
    describe('with valid body', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      })
      after( done => {
        if(this.tempList) {
          List.remove({})
          .then(() => done())
          .catch(done)
          return;
        }
        done();
      });
      it('should return a list', (done) => {
        var updateList = {
          name: 'slug'
        }
        request.put(`${url}/api/list/${this.tempList._id}`)
        .send(updateList)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updateList.name);
          let timestamp = new Date(res.body.timestamp);
          expect(timestamp.toString()).to.equal(exampleList.timestamp.toString());
          this.tempList = res.body;
          done();
        });
      });
    });
  });
  describe('testing GET requests with pagination', function() {
    describe('with valid query', function() {
      before( done => {
        var lists = [];
        for (var i = 0; i < 1000; i++) {
          lists.push(new List(exampleList).save())
        }
        Promise.all(lists)
        .then( list => {
          this.tempLists = lists;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempLists) {
          List.remove({})
          .then(() => done())
          .catch(done)
          return;
        }
        done();
      });
      it('should return 50 lists', (done) => {
        request.get(`${url}/api/list`)
        .end((err, res)=>{
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(50);
          done();
        });
      });
      it('should return a 3 lists', (done) => {
        request.get(`${url}/api/list?pagesize=3`)
        .end((err, res)=>{
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          done();
        });
      });
    });
  });
});
