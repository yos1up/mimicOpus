exports.server_cmn = (app) => {
  app.get('/test', (req, res) => res.send({ test: "test" }));
}
