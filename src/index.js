const createServer = require("./server")
require("dotenv").config();
const connectionString = process.env.ATLAS_URI;

const db = require("./models");
const Role = db.role;
db.mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => {
    initial();
    const PORT = process.env.PORT || 3000;
    const app = createServer();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
})
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(SaveErr => {
          if (SaveErr) {
            console.log("error", SaveErr);
          }
          console.log("added 'user' to roles collection");
        });
        new Role({
          name: "moderator"
        }).save(SaveErr => {
          if (SaveErr) {
            console.log("error", SaveErr);
          }
          console.log("added 'moderator' to roles collection");
        });
        new Role({
          name: "admin"
        }).save(SaveErr => {
          if (SaveErr) {
            console.log("error", SaveErr);
          }
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }