const should = require('should');
const AuthenticationController = require('../controllers/authentication');
const passportService = require('./passport');

describe("Configuration:", () => {
  describe("passport:", () => {
    it("should load passport configuration", () => {
      should.exist(passportService);
    });
  });
});
