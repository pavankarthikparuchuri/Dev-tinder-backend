const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/authMiddleware");

const app = express(); //ceating an express application instance.

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent");
});

app.post("/user", (req, res) => {
  res.send("user logged in successfully");
});

app.get("/user", userAuth, (req, res) => {
  console.log("coming here");
  res.send("user data sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("DeletedUser");
});
app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
