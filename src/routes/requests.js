const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("sending a connection request");
  const { user } = req;
  res.send("Hey " + user.firstName + "!");
});

module.exports = requestsRouter;
