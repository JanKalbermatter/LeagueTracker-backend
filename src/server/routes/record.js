const express = require("express");
// get driver connection
const dbo = require("../../db/conn");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();
console.log(process.env.ATLAS_URI);

// This section will help you get a list of all the documents.
recordRoutes.route("/user").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    if(dbConnect) {
        dbConnect
            .collection("user")
            .find({}).limit(50)
            .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
    }
});

// This section will help you get a list of all the documents.
recordRoutes.route("/test").get(async function (req, res) {
    res.status(200).send("Test success");
});

module.exports = recordRoutes