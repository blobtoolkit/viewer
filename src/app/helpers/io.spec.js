const should = require('should');
const io = require('./io');

const test_files = '../../../test/files';
describe("io:", () => {
  describe("absolutePath(path):", () => {
    it("should convert a relative path to an absolute path", () => {
      return io.absolutePath(test_files+'/blobDB.json')
        .then((path) => {
          should.exist(path);
          path.should.not.match('..')
        });
    });
  });
  describe("fileExists(file):", () => {
    it("should return true if file exists", () => {
      return io.fileExists(test_files+'/blobDB.json')
        .then((bool) => {
          bool.should.be.true();
        });
    });
    it("should return false if file not exists", () => {
      return io.fileExists(test_files+'/lobDB.json')
        .then((bool) => {
          bool.should.be.false();
        });
    });
  });
  describe("readJSON(file):", () => {
    it("should read a file and return parsed JSON", () => {
      return io.readJSON(test_files+'/blobDB.json')
        .then((data) => {
          should.exist(data);
          data.should.have.property('seqs',10)
        });
    });
  });
  describe("writeJSON(file,data):", () => {
    it("should write data to a JSON file", () => {
      return io.writeJSON(test_files+'/out/test.io.writeJSON.json',{id:'test'})
        .then((bool) => {
          bool.should.be.true();
        });
    });
  });
});
