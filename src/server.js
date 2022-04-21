const express = require("express");
const cors = require("cors");

function createServer() {
  const app = express();

  app.use(cors());
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Jan's application." });
  });
  
  // routes
  require('./routes/auth.routes')(app);
  require('./routes/user.routes')(app);
  require('./routes/log.routes')(app);

  return app;
}


module.exports = createServer