const express = require("express")
var cors = require('cors')
const app = express()

app.use(cors())

app.get("/test", (_req, res) =>  {
  res.status(200).send("{}")
})

app.get("/api/log", (_req, res) =>  {
  res.status(200).send(JSON.stringify({"Success": true}))
})
module.exports = app;