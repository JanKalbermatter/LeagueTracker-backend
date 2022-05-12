const secret = process.env.JWT_SECRET
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  
  return user.save((err, savedUser) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      return Role.find(
        {
          name: { $in: req.body.roles }
        },
        (roleError, roles) => {
          if (roleError) {
            res.status(500).send({ message: roleError });
            return;
          }
          savedUser.roles = roles.map(role => role._id);
          return savedUser.save(userError => isUserRegistered(userError, res));
        }
      );
    } else {
      return Role.findOne({ name: "user" }, (roleError, role) => {
        if (roleError) {
          return res.status(500).send({ message: roleError });
        }
        savedUser.roles = [role._id];
        return savedUser.save(userError => isUserRegistered(userError, res));
      });
    }
  });
};

exports.signin = (req, res) => {
  return User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((userError, user) => {
      if (userError) {
        res.status(500).send({ message: userError });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      for (const element of user.roles) {
        authorities.push("ROLE_" + element.name.toUpperCase());
      }

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

function isUserRegistered(error, res) {
  if (error) {
    return res.status(500).send({ message: error });
  }
  return res.send({ message: "User was registered successfully!" });
}