const should = require('should');
const td = require('testdouble');
const config = require('../../config/main')('test')
const Field = require('./field');

describe("Field model:", () => {
  describe("loadValues(id,index)", () => {
    it("should load all values for a field", async () => {
      let field = new Field('gc','ds1');
      let result = await field.loadData();
      result.should.be.a.Object();
      result.should.have.property('values');
    });
  });
  describe("loadValuesAtIndex()", () => {
    it("should load a specific value for a field", async () => {
      let field = new Field('gc','ds1');
      let result = await field.loadDataAtIndex(7);
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(1);
      result.values[0].should.equal(0.2801);
    });
    it("should load a range of values for a field", async () => {
      let field = new Field('gc','ds1');
      let result = await field.loadDataAtIndex('5-7');
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(3);
      result.values[0].should.equal(0.1944);
    });
    it("should load comma-separated ranges", async () => {
      let field = new Field('gc','ds1');
      let result = await field.loadDataAtIndex('1,5-7');
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(4);
      result.values[0].should.equal(0.2623);
      result.values[3].should.equal(0.2801);
    });
    it("should reject incomplete ranges", async () => {
      let field = new Field('gc','ds1');
      let result = await field.loadDataAtIndex('1,-7');
      should.not.exist(result);
    });
    it("should reject reversed ranges", async () => {
      let field = new Field('gc','ds1');
      let result = await field.loadDataAtIndex('8-7');
      should.not.exist(result);
    });
    it("should return translated value for key-value fields", async () => {
      let field = new Field('bestsum_family','ds1');
      let result = await field.loadDataAtIndex('5');
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(1);
      result.values[0].should.match('Hypsibiidae');
    });
  });

});
