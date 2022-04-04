const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const record = require("./routes/record")
const log = require("./routes/log")
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(record);
app.use(log);

// get driver connection
const dbo = require("../db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});

module.exports = app