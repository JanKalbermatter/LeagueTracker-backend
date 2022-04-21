const db = require("../models");
const { ObjectId } = require("mongodb");
const Log = db.log;
exports.getAllLogs = (req, res) => {
    Log.find({

    })
    .exec((err, result) => {
        if (err) {
            res.status(400).send({ message: err });
        } else {
            res.json(result);
        }
    })
}
exports.getLogById = (req, res) => {
    const logId = req.params.logId
    Log.findOne({
        _id: ObjectId(logId)
    })
    .exec((err, result) => {
        if (err) {
            res.status(400).send({ message: err });
        } else {
            res.json(result);
        }
    })
}
exports.getLogByTimestamp = (req, res) => {
    const start = parseInt(req.params.start) || 0
    let end = parseInt(req.params.end) || 0
    
    if(end === 0) {
        end = Date.now()
    } 
    const filter = { entryDate: {$gte: start, $lte: end}}
    Log.find(
        filter
    )
    .exec((err, result) => {
        if (err) {
            res.status(400).send({ message: err });
        } else {
            res.json(result);
        }
    })
}
exports.addLog = (req, res) => {
    const logEntry = req.body
    const log = new Log({
      entryDate: logEntry.entryDate,
      message: logEntry.message,
      level: logEntry.level,
      extraInfo: logEntry.extraInfo,
      logWithDate: logEntry.logWithDate
    });
    log.save(err => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "Log was created successfully!", log});
    });
}