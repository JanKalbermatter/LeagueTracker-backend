const logger = require("../config/logger")

const logRequest = (req, _res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`)
    next();
};

const logResponse = (req, res, next) => {
    let oldWrite = res.write;
    let oldEnd = res.end;

    let chunks = []

    res.write = function(chunk) {
        chunks.push(chunk)

        return oldWrite.apply(res, arguments)
    }

    res.end = function(chunk) {
        if(chunk) {
            chunks.push(chunk)
        }
        let body = Buffer.concat(chunks).toString("utf8")
        if(res.statusCode >= 400) { //4xx = client error, 5xx = server error
            logger.error(`ERROR ${res.statusCode} (${req.method} ${req.originalUrl}): ${body}`)
        } else {
            logger.info(`Sending reply (${req.method} ${req.originalUrl}): ${body}`)
        }

        oldEnd.apply(res, arguments)
    }

    next()
}

const logError = function(req, res, _next) {
    res.status(404).send({ message: `Cannot ${req.method} ${req.originalUrl}` });
}
  
const logHandler = {
    logRequest,
    logResponse,
    logError
};
module.exports = logHandler;