const express = require("express")
const app = express()

app.get("/test", (_req, res) =>  {
  res.status(200).send("{}")
})

app.get("/api/log", (_req, res) =>  {
  console.log(_req, res)
  res.status(200).send(JSON.stringify({"req": _req.rawHeaders}))
})
module.exports = app;