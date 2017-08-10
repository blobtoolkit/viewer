const should = require('should');
const mongoose = require('mongoose');
mongoose.Promise = require('promise');
const config = require('../../config/main')
const dbURI = config.dbHost
const clearDB = require('mocha-mongoose')(dbURI);
const User = require('./user');

const user_data = {
  "email": "cbabbage@example.com",
  "password": "difference-engine"
}

describe("User model:", () => {
  describe("new User():", () => {
    it("should be invalid if email and/or password are empty", (done) => {
      let user = new User();
      user.validate((err,model) => {
        should.exist(err);
        err.errors.should.have.enumerable('email');
        err.errors.should.have.enumerable('password');
        done();
      });
    });
    it("should only require an email and password", (done) => {
      let user = new User(user_data);
      user.validate((err) => {
        should.not.exist(err);
        done();
      });
    });
    describe("roles:", function() {
      it("should set default role to Member", (done) => {
        let user = new User(user_data);
        user._doc.should.have.enumerable('role','Member');
        done();
      });
      it("should allow Admin role", (done) => {
        let clone = JSON.parse(JSON.stringify(user_data));
        clone.role = 'Admin';
        let user = new User(clone);
        user.validate((err) => {
          should.not.exist(err);
          done();
        });
      });
      it("should allow Owner role", (done) => {
        let clone = JSON.parse(JSON.stringify(user_data));
        clone.role = 'Owner';
        let user = new User(clone);
        user.validate((err) => {
          should.not.exist(err);
          done();
        });
      });
      it("should reject other roles", (done) => {
        let clone = JSON.parse(JSON.stringify(user_data));
        clone.role = 'Other';
        let user = new User(clone);
        user.validate((err) => {
          err.errors.should.have.enumerable('role');
          done();
        });
      });
    });
  });
  describe("db functions:", () => {
    it("user can be saved", (done) => {
      let user = new User(user_data)
      user.save((err,model) => {
        if (err) return done(err);
        User.find({}, (err, docs) => {
          if (err) return done(err);
          docs.length.should.equal(1);
          done();
        });
      });
    });
    it("accepts correct password", (done) => {
      new User(user_data).save((err,model) => {
        User.findOne({ email: 'cbabbage@example.com' }, (err, user) => {
          if (err) return done(err);
          // test a matching password
          user.comparePassword('difference-engine', (err, isMatch) => {
            if (err) return done(err);
            isMatch.should.be.true();
            done();
          });
        });
      });
    });
    it("rejects incorrect password", (done) => {
      new User(user_data).save((err,model) => {
        User.findOne({ email: 'cbabbage@example.com' }, (err, user) => {
          if (err) return done(err);
          // test a mismatched password
          user.comparePassword('analytical-engine', (err, isMatch) => {
            if (err) return done(err);
            isMatch.should.be.false();
            done();
          });
        });
      });
    });
  });

});
