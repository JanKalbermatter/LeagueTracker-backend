const express = require("express");

// get driver connection
const dbo = require("../../db/conn");

const recordRoutes = express.Router();

// return a list with the users
recordRoutes.route("/api/v1/user").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    if(dbConnect) {
        dbConnect
            .collection("user")
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

module.exports = recordRoutes