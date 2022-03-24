const express = require("express")
const app = express()

// app.use(allowCrossDomain)

app.get("/test", (_req, res) =>  {
  res.status(200).send("{}")
})

app.get("/api/log", (_req, res) =>  {
  res.status(200).send(JSON.stringify({"Success": true}))
})
module.exports = app;