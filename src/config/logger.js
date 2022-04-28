const { createLogger, transports, format} = require("winston")
require('winston-mongodb');
require("dotenv").config();

const logger = createLogger({
    transports: [
        new transports.File({
            filename: "error.log",
            level: "error"
        }),
        new transports.File({
            filename: "combined.log"
        })
    ]
})

if(process.env.NODE_ENV === 'production') {
    logger.add(
        new transports.MongoDB({
            db: process.env.ATLAS_URI_BACKEND,
            options: { useUnifiedTopology: true },
            level: 'info',
            collection: 'logInfo',
            format: format.combine(format.timestamp(), format.json())
        })
    )
    
    logger.add(
        new transports.MongoDB({
            db: process.env.ATLAS_URI_BACKEND,
            options: { useUnifiedTopology: true },
            level: 'error',
            collection: 'logError',
            format: format.combine(format.timestamp(), format.json())
        })
    )
}

module.exports = logger