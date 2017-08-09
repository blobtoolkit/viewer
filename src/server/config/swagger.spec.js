var should = require('should');
var swagger = require('./swagger');

describe("Configuration:", () => {
  describe("swagger:", () => {
    it("should load swagger configuration", () => {
      swagger.should.have.enumerable('options');
      swagger.options.should.be.Object();
      swagger.options.should.not.be.empty();
    });
    describe("key values:", () => {
      describe("swaggerDefinition:", () => {
        it("exists", () => {
          swagger.options.should.have.enumerable('swaggerDefinition');
          swagger.options.swaggerDefinition.should.be.Object();
          swagger.options.swaggerDefinition.should.not.be.empty();
        });
        describe("key values:", () => {
          it("info", () => {
            swagger.options.swaggerDefinition.should.have.enumerable('info');
            swagger.options.swaggerDefinition.info.should.be.Object();
            swagger.options.swaggerDefinition.info.should.not.be.empty();
          });
          it("host", () => {
            swagger.options.swaggerDefinition.should.have.enumerable('host');
            swagger.options.swaggerDefinition.host.should.be.String();
            swagger.options.swaggerDefinition.host.should.not.be.empty();
            swagger.options.swaggerDefinition.host.should.match(/^https*:\/\/.+:\d+/);
          });
          it("basePath", () => {
            swagger.options.swaggerDefinition.should.have.enumerable('basePath');
            swagger.options.swaggerDefinition.basePath.should.be.String();
            swagger.options.swaggerDefinition.basePath.should.not.be.empty();
          });
        });
      });
      it("apis", () => {
        swagger.options.should.have.enumerable('apis');
        swagger.options.apis.should.be.Array();
        swagger.options.apis.should.not.be.empty();
      });
    });
  });
});
