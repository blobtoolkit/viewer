module.exports = function(app, db) {
  var directory = app.locals.directory;
  /**
   * @swagger
   * /api/v1/summary/{dataset_id}:
   *   get:
   *     tags:
   *       - Summary
   *     description: Returns processed summary data for a dataset
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An object containing summary data
   *     parameters:
   *       - $ref: "#/parameters/dataset_id"
   */
  app.get('/api/v1/summary/:dataset_id', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.sendFile(directory+"/"+req.params.dataset_id+"/summary.json");
  });
};
