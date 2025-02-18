const express = require("express");

const app = express(); //ceating an express application instance.

app.use("/test", (req, res) => {
  res.send("testing....");
}); // the callback function used inside is called request handler

app.use("/hello", (req, res) => {
  res.send("Hello hello hello");
});

app.use("/", (req, res) => {
  res.send("home page");
});

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
