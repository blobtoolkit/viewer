const should = require('should');

describe("Configuration:", () => {
  describe("main:", () => {
    let main = undefined;
    describe("local:", () => {
      before(function(done){
        main = require('./main')();
        done();
      });
      it("should load local configuration", () => {
        main.should.have.enumerable('mode');
        main.mode.should.equal('local');
      });
      describe("key values:", () => {
        it("secret", () => {
          main.should.have.enumerable('secret');
          main.secret.should.be.String();
          main.secret.should.not.be.empty();
        });
        it("dbhost", () => {
          main.should.have.enumerable('dbhost');
          main.dbhost.should.be.String();
          main.dbhost.should.not.be.empty();
        });
        it("port", () => {
          main.should.have.enumerable('port');
          main.port.should.be.Number();
          String(main.port).should.match(/^\d+$/);
        });
        it("https", () => {
          main.should.have.enumerable('https');
          main.https.should.be.Boolean();
        });
        it("cors", () => {
          main.should.have.enumerable('cors');
          main.cors.should.be.Object();
          main.cors.should.have.enumerable('allowedOrigins');
          main.cors.allowedOrigins.should.be.Array();
          main.cors.allowedOrigins.should.not.be.empty();
        });
        it("filePath", () => {
          main.should.have.enumerable('filePath');
          main.filePath.should.be.String();
          main.filePath.should.not.be.empty();
        });
        it("version", () => {
          main.should.have.enumerable('version');
          main.version.should.not.be.empty();
        });
        it("hostname", () => {
          main.should.have.enumerable('hostname');
          main.hostname.should.not.be.empty();
        });
      });
    });
    describe("staging:", () => {
      before(function(done){
        main = require('./main')('staging');
        done();
      });
      it("should load staging configuration", () => {
        main.should.have.enumerable('mode');
        main.mode.should.equal('staging');
      });
    });
    describe("production:", () => {
      before(function(done){
        main = require('./main')('production');
        done();
      });
      it("should load production configuration", () => {
        main.should.have.enumerable('mode');
        main.mode.should.equal('production');
      });
    });
  });
});
