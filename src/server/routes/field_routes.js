const appRoot = require('app-root-path');
const Field = require('../models/field');
const utils = require('../../shared/functions/utils');

module.exports = function(app, db) {
/**
 * @swagger
 * definition:
 *   Field:
 *     properties:
 *       id:
 *         type: string
 *         description: a unique identifier
 *         required: true
 *       name:
 *         description: a human-readable name
 *         type: string
 *         required: true
 *       description:
 *         description: a brief description
 *         type: string
 *         required: false
 *       datatype:
 *         description: the datatype must be one of integer, float, boolean or string
 *         type: string
 *         enum:
 *           - float
 *           - integer
 *           - boolean
 *           - string
 *         required: true
 *       type:
 *         description: the type must be one of variable, category, label or identifier
 *         type: string
 *         enum:
 *           - variable
 *           - category
 *           - label
 *           - identifier
 *         required: true
 *       range:
 *         description: (optional) an array of length 2 containing minimum and maximum values
 *         type: array
 *         items:
 *           type: number
 *           format: float
 *         minItems: 2
 *         maxItems: 2
 *         required: false
 *       preload:
 *         description: (optional) a flag to indicate whether this field should be loaded for visualisation without user prompting
 *         type: boolean
 *         required: false
 *       logged:
 *         description: (optional) a flag to indicate that the data have been log transformed
 *         type: boolean
 *         required: false
 *       base:
 *         description: (optional) the base used to log transform values
 *         type: number
 *         format: float
 *         required: false
 *         default: 1.0
 *       array_length:
 *         description: (optional) the length of array returned for each record value
 *         type: number
 *         format: integer
 *         required: false
 *         default: 1
 *       children:
 *         description: (optional) an array of nested field IDs
 *         type: array
 *         items:
 *           type: string
 *         required: false
 *       data:
 *         description: (optional) an array of nested data
 *         type: array
 *         items:
 *           type: object
 *         required: false
 */
/**
 * @swagger
 * definition:
 *   Value:
 *     properties:
 *       values:
 *         type: array
 *         description: an array of values
 *         required: true
 *       keys:
 *         type: array
 *         items:
 *           type: object
 *         description: an array of key-value pairs
 *         required: false

 */
/**
 * @swagger
 * parameter:
 *   field_id:
 *     in: path
 *     name: field_id
 *     type: string
 *     required: true
 *     description: Unique identifier of the requested field
 */
/**
 * @swagger
 * parameter:
 *   index:
 *     in: path
 *     name: index
 *     type: number
 *     format: integer
 *     required: true
 *     description: index of the requested record
 */
/**
 * @swagger
 * /api/v1/field/{dataset_id}/{field_id}:
 *   get:
 *     tags:
 *       - Datasets
 *     description: Returns all values for a field
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An object containing an array of variable values
 *         schema:
 *           $ref: '#/definitions/Value'
 *     parameters:
 *       - $ref: "#/parameters/dataset_id"
 *       - $ref: "#/parameters/field_id"
 */
  app.get('/api/v1/field/:dataset_id/:field_id', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    let field = new Field(req.params.field_id,{id:req.params.dataset_id});
    let data = await field.loadData();
    if (data.hasOwnProperty('values')){
      res.json(data)
    }
    else {
      res.sendStatus(404);
    }
  });
/**
 * @swagger
 * /api/v1/field/dataset/{dataset_id}/{field_id}/{index}:
 *   get:
 *     tags:
 *       - Datasets
 *     description: Returns specific values for a field
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An object containing an array of variable values
 *         schema:
 *           $ref: '#/definitions/Value'
 *     parameters:
 *       - $ref: "#/parameters/dataset_id"
 *       - $ref: "#/parameters/field_id"
 *       - $ref: "#/parameters/index"
 */
  app.get('/api/v1/field/:dataset_id/:field_id/:index', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    let field = new Field(req.params.field_id,{id:req.params.dataset_id});
    let data = await field.loadDataAtIndex(req.params.index);
    if (data.hasOwnProperty('values')){
      res.json(data)
    }
    else {
      res.sendStatus(404);
    }
  });
};
