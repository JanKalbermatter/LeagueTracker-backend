const express = require("express");
const cors = require("cors");
const { logRequest, logResponse, logError } = require("./middlewares/logHandler")

function createServer() {
  const app = express();

  app.use(logRequest)
  app.use(logResponse)

  app.use(cors());
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // simple route
  app.get("/", (_req, res) => {
    res.json({ message: "Welcome to Jan's application." });
  });
  
  // routes
  require('./routes/auth.routes')(app);
  require('./routes/user.routes')(app);
  require('./routes/log.routes')(app);

  app.use(function(req, res, _next) {
    res.status(404).send({ message: `Cannot ${req.method} ${req.originalUrl}` });
  });

  return app;
}


module.exports = createServer