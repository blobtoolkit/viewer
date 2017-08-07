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
  describe("scaleType(value)", (done) => {
    let filter;
    beforeEach((done) => {
      filter = new Filter('gc','ds1');
      done();
    })
    it("should return the name of the scale function if called with no value", (done) => {
      let result = filter.scaleType();
      result.should.be.a.String();
      result.should.match('scaleLinear');
      done();
    });
    it("should change the scale function if a valid value is passed", (done) => {
      let result = filter.scaleType('scaleLog');
      result.should.be.a.String();
      result.should.match('scaleLog');
      result = filter.scaleType('scaleSqrt');
      result.should.be.a.String();
      result.should.match('scaleSqrt');
      done();
    });
    it("should return undefined if an invalid value is passed", (done) => {
      let result = filter.scaleType('scaleInvalid');
      should.not.exist(result);
      done();
    });
  }};
  describe("range(arr)", () => {
    let filter;
    beforeEach((done) => {
      filter = new Filter('gc','ds1');
      done();
    })
    it("should set range limits for the field", (done) => {
      filter.range([0,2]);
      filter._range.should.be.a.Array();
      filter._range.should.match([0,2]);
      done();
    });
    it("should return range when called with no values", (done) => {
      filter.range([0,2]);
      let range = filter.range();
      range.should.be.a.Array();
      range.should.match([0,2]);
      done();
    });
    it("should return range when called with an empty array", (done) => {
      filter.range([0,2]);
      let range = filter.range([]);
      range.should.be.a.Array();
      range.should.match([0,2]);
      done();
    });
    it("should set allow inverted max and min", (done) => {
      filter.range([3,1]);
      filter._range.should.be.a.Array();
      filter._range.should.match([1,3]);
      done();
    });
    it("should find max and min if array is too long", (done) => {
      filter.range([2,3,0,1]);
      filter._range.should.be.a.Array();
      filter._range.should.match([0,3]);
      done();
    });
    it("should set max and min to a single value if only one value is passed", (done) => {
      filter.range([2]);
      filter._range.should.be.a.Array();
      filter._range.should.match([2,2]);
      done();
    });
  });
  describe("rangeHigh(value)", (done) => {
    let filter;
    beforeEach((done) => {
      filter = new Filter('gc','ds1');
      filter.range([1,3]);
      done();
    })
    it("should increase upper range limit for the field", (done) => {
      filter.rangeHigh(4);
      filter._range.should.be.a.Array();
      filter._range.should.match([1,4]);
      done();
    });
    it("should reduce upper range limit for the field", (done) => {
      filter.rangeHigh(2);
      filter._range.should.be.a.Array();
      filter._range.should.match([1,2]);
      done();
    });
    it("should reduce the lower range limit if below existing range", (done) => {
      filter.rangeHigh(0);
      filter._range.should.be.a.Array();
      filter._range.should.match([0,0]);
      done();
    });
    it("should return upper range limit when called with no values", (done) => {
      let range = filter.rangeHigh();
      range.should.be.a.Number();
      range.should.equal(3);
      done();
    });
    it("should return upper range limit when called with an invalid datatype", (done) => {
      let range = filter.rangeHigh('2');
      range.should.be.a.Number();
      range.should.equal(3);
      done();
    });
  });
  describe("rangeLow(value)", (done) => {
    let filter;
    beforeEach((done) => {
      filter = new Filter('gc','ds1');
      filter.range([1,3]);
      done();
    })
    it("should reduce lower range limit for the field", (done) => {
      filter.rangeLow(0);
      filter._range.should.be.a.Array();
      filter._range.should.match([0,3]);
      done();
    });
    it("should increase lower range limit for the field", (done) => {
      filter.rangeLow(2);
      filter._range.should.be.a.Array();
      filter._range.should.match([2,3]);
      done();
    });
    it("should increase the upper range limit if value is above existing range", (done) => {
      filter.rangeLow(4);
      filter._range.should.be.a.Array();
      filter._range.should.match([4,4]);
      done();
    });
    it("should return lower range limit when called with no values", (done) => {
      let range = filter.rangeLow();
      range.should.be.a.Number();
      range.should.equal(1);
      done();
    });
    it("should return lower range limit when called with an invalid datatype", (done) => {
      let range = filter.rangeLow('2');
      range.should.be.a.Number();
      range.should.equal(1);
      done();
    });
  });
});
