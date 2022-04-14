const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/v1/user/loggedIn", [authJwt.verifyToken], controller.loggedIn);
  app.get("/api/v1/user/isModerator",
    [authJwt.verifyToken, authJwt.isModerator], 
    controller.isModerator
    );
  app.get(
    "/api/v1/user/isAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.isAdmin
  );
};