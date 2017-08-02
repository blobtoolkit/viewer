const should = require('should');
const td = require('testdouble');
const config = require('../../config/main')('test')
const Dataset = require('./dataset');
const waitOn = require('../helpers/utils').waitOn;

let dataset = undefined;
const id = 'ds1';
const blobDBFile = '../../../test/files/blobDB.json';
const filePath = config.filePath;
const blobDB = require(blobDBFile);

describe("Dataset model:", () => {
  beforeEach((done) => {
    dataset = new Dataset(id);
    done();
  })
  describe("loadBlobDB()", () => {
    it("should load a blobDB for a dataset", async () => {
      let blobDB = await dataset.loadBlobDB(blobDBFile);
      should.exist(blobDB);
    });
  });
  describe("prepareMeta()", () => {
    beforeEach(()=>{
      dataset.blobDB = blobDB;
    })
    it("should convert a blobDB into a meta object", async () => {
      //dataset.blobDBFile = blobDBFile;
      let meta = await dataset.prepareMeta(filePath);
      should.exist(meta);
      meta.should.have.property('filePath',filePath);
      meta.should.have.properties('id','name','records','record_type','fields');
      meta.id.should.be.String();
      meta.id.should.not.be.empty();
      meta.id.should.match(/^[\w\d]+$/);
      meta.name.should.be.String();
      meta.name.should.not.be.empty();
      meta.records.should.be.Number();
      meta.records.should.be.greaterThan(0);
      meta.record_type.should.be.String();
      meta.record_type.should.not.be.empty();
      meta.fields.should.be.Array();
      meta.fields.should.not.be.empty();
    });
  });
  describe("storeMeta()", () => {
    let promise;
    beforeEach(()=>{
      dataset.blobDBFile = blobDBFile;
      promise = dataset.prepareMeta(filePath)
    })
    it("should store meta for a dataset", () => {
      promise.then(async () => {
        let success = await dataset.storeMeta();
        should.exist(success);
        success.should.be.true();
      })
    });
  });
  describe("loadMeta()", () => {
    it("should load meta for a dataset", async () => {
      let meta = await dataset.loadMeta(id);
      should.exist(meta);
    });
  });
  describe("storeLineages()", () => {
    let promise;
    beforeEach(() => {
      promise = dataset.loadMeta(id);
      dataset.blobDB = blobDB;
    });
    it("should store lineages for a dataset", () => {
      promise.then(async () => {
        let success = await dataset.storeLineages();
        should.exist(success);
        success.should.be.true();
      });
    });
  });
  describe("storeValues()", () => {
    let promise;
    beforeEach(() => {
      promise = dataset.loadMeta(id);
      dataset.blobDB = blobDB;
    });
    it("should store values for a dataset", () => {
      promise.then(async () => {
        let success = await dataset.storeValues('hits')
        success = success[0];
        success.should.be.a.Array();
        success[0].should.be.True();
      }).catch((e)=>{throw new Error(e)});
    });
  });
  describe("storeAllValues()", () => {
    let promise;
    beforeEach(() => {
      promise = dataset.loadMeta(id);
      dataset.blobDB = blobDB;
    });
    it("should store all values for a dataset", () => {
      promise.then(async () => {
        let success = await dataset.storeAllValues()
        success = success[0];
        success.should.be.a.Array();
        success[0].should.match(true);
      })
    });
  });
  describe("loadValues(id,index)", () => {
    it("should load all values for a field", async () => {
      let result = await dataset.loadValues('gc');
      result.should.be.a.Object();
      result.should.have.property('values');
    });
  });
  describe("loadValuesAtIndex()", () => {
    it("should load a specific value for a field", async () => {
      let result = await dataset.loadValuesAtIndex('gc',7);
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(1);
      result.values[0].should.equal(0.2801);
    });
    it("should load a range of values for a field", async () => {
      let result = await dataset.loadValuesAtIndex('gc','5-7');
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(3);
      result.values[0].should.equal(0.1944);
    });
    it("should load comma-separated ranges", async () => {
      let result = await dataset.loadValuesAtIndex('gc','1,5-7');
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(4);
      result.values[0].should.equal(0.2623);
      result.values[3].should.equal(0.2801);
    });
    it("should reject incomplete ranges", async () => {
      let result = await dataset.loadValuesAtIndex('gc','1,-7');
      should.not.exist(result);
    });
    it("should reject reversed ranges", async () => {
      let result = await dataset.loadValuesAtIndex('gc','8-7');
      should.not.exist(result);
    });
    it("should return translated value for key-value fields", async () => {
      let result = await dataset.loadValuesAtIndex('bestsum_family','5');
      result.should.be.a.Object();
      result.should.have.property('values');
      result.values.length.should.equal(1);
      result.values[0].should.match('Hypsibiidae');
    });
  });

});
