const express = require("express");
// get driver connection
const dbo = require("../../db/conn");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const logRoutes = express.Router();

// return a list with the logs
logRoutes.route("/api/v1/log").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    if(dbConnect) {
        dbConnect
            .collection("log")
            .find({})
            .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
    } else {
        res.json({Msg: "No DB Connection"});
    }
});

module.exports = logRoutes