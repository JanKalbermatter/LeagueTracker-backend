const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (roleError, roles) => {
        if (roleError) {
          res.status(500).send({ message: roleError });
          return;
        }
        for (const element of roles) {
          if (element.name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ admin: false, message: "Require Admin Role!" });
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (roleError, roles) => {
        if (roleError) {
          res.status(500).send({ message: roleError });
          return;
        }
        for (const element of roles) {
          if (element.name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ moderator: false, message: "Require Moderator Role!" });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;