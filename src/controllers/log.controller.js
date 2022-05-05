const db = require("../models");
const { ObjectId } = require("mongodb");
const Log = db.log;
exports.getAllLogs = (_req, res) => {
    return Log.find(
        {},
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: err });
            } else {
                return res.json(result);
            }
        }
    )
}
exports.getLogById = (req, res) => {
    const logId = req.params.logId
    const filter = {
        _id: ObjectId(logId)
    }

    return Log.findOne(
        filter, 
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: err });
            } else {
                return res.json(result);
            }
        }
    )
}

exports.getLogByTimestamp = (req, res) => {
    const start = parseInt(req.params.start) || 0
    let end = parseInt(req.params.end) || 0
    
    if(end === 0) {
        end = Date.now()
    } 
    const filter = { 
        entryDate: {$gte: start, $lte: end}
    }

    return Log.find(
        filter, 
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: err });
            } else {
                return res.json(result);
            }
        }

    )
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
    return log.save(err => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        return res.send(log);
    });
}