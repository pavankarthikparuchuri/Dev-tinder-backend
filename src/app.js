const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/authMiddleware");

const app = express(); //ceating an express application instance.

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("error");
    res.send("user data sent");
  } catch (err) {
    res.status(500).send("something went wrong, contact support team");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
