const controller = require("../controllers/log.controller");
module.exports = function(app) {
    app.use(function(_req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/v1/log", controller.getAllLogs);
    app.get("/api/v1/log/:logId", controller.getLogById);
    app.get("/api/v1/log/date/:start/:end", controller.getLogByTimestamp);
    app.post("/api/v1/log", controller.addLog);
};