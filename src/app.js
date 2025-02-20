const express = require("express");

const app = express(); //ceating an express application instance.

//order of the routes matter
//app.use method maps to all the http methods
app.use(
  "/user",
  [
    (req, res, next) => {
      console.log("Handling the route user1");
      next();
    },
    (req, res, next) => {
      console.log("Handling the route user3");
      next();
    },
  ],
  (req, res) => {
    res.send("hello");
  }
);

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
