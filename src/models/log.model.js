const mongoose = require("mongoose");
const Log = mongoose.model(
    "Log",
    new mongoose.Schema({
        entryDate: Number,
        message: String,
        level: Number, 
        extraInfo: [],
        logWithDate: Boolean
    })
);
module.exports = Log;