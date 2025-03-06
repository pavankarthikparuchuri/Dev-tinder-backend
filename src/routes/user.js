const express = require("express");
const connectionModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await connectionModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender about skill"
      );
    res.status(200).json({
      message: `${loggedInUser.firstName} - requests`,
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await connectionModel
      .find({
        $or: [
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
          {
            fromUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", "firstName lastName skills about age ")
      .populate("toUserId", "firstName lastName skills about age ");
    const finalData = data.map(({ fromUserId, toUserId }) =>
      fromUserId._id.equals(loggedInUser._id) ? toUserId : fromUserId
    );
    res.status(200).json({
      message: `${loggedInUser.firstName} - connections`,
      data: finalData,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = userRouter;
