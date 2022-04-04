const express = require("express");
const { ObjectId } = require("mongodb");

// get driver connection
const dbo = require("../../db/conn");

const logRoutes = express.Router();

// return a list with the logEntries
logRoutes.route("/api/v1/log").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    if(dbConnect) {
        dbConnect
            .collection("log")
            .find({})
            .toArray((err, result) => returnFetchedResults(res, err, result));
    } else {
        res.json({Msg: "No DB Connection"});
    }
});

// return the requested logEntry (logId)
logRoutes.route("/api/v1/log/:logId").get(async function (req, res) {
    const dbConnect = dbo.getDb();
    const logId = req.params.logId

    if(dbConnect) {
        dbConnect
            .collection("log")
            .find({ _id: ObjectId(logId)})
            .toArray((err, result) => returnFetchedResults(res, err, result));
    } else {
        res.json({Msg: "No DB Connection"});
    }
});

// return the requested logEntry (timestamp from-until)
logRoutes.route("/api/v1/log/date/:start/:end").get(async function (req, res) {
    const dbConnect = dbo.getDb();

    const start = parseInt(req.params.start) || 0
    let end = parseInt(req.params.end) || 0
    
    if(end === 0) {
        end = Date.now()
    } 

    if(dbConnect) {
        dbConnect
            .collection("log")
            .find({ entryDate: {$gte: start, $lte: end}})
            .toArray((err, result) => returnFetchedResults(res, err, result));
    } else {
        res.json({Msg: "No DB Connection"});
    }
});

// Add a new logEntry
logRoutes.route("/api/v1/log").put(async function (req, res) {
    const dbConnect = dbo.getDb();
    const logEntry = req.body

    if(dbConnect) {
        // Insert LogEntry to collection log
        dbConnect.collection("log").insertOne(logEntry, (err, result) => {
            if (err) {
                res.status(400).send({ Msg: "Entry not created."});
            } else {
                res.status(200).json(result);
            }
        })
    } else {
        res.json({Msg: "No DB Connection"});
    }
});

module.exports = logRoutes

// Return the results from mongoDB. Show error if request failed. 
function returnFetchedResults(result, error, returnValue=null, errorMessage='Error fetching entries!') {
    if(!returnValue) {
        returnValue = result
    }

    if (error) {
        result.status(400).send(errorMessage);
    } else {
        result.json(returnValue);
    }
}