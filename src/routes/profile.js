const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

module.exports = profileRouter;
