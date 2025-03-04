const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const UserModel = require("../models/user");
const ConnectionModel = require("../models/connectionRequest");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const { user } = req;

      const ALLOWED_STATUS = ["ignored", "interested"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("invalid status type :" + status);
      }
      const searchUserID = await UserModel.findById(toUserId);
      if (!searchUserID) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const existedReqestCheck = await ConnectionModel.findOne({
        $or: [
          { fromUserId: toUserId, toUserId: user._id },
          { fromUserId: user._id, toUserId: toUserId },
        ],
      });
      if (existedReqestCheck) {
        return res.status(400).json({
          message: "Connection request already exist",
        });
      }
      const ConnectionRequest = new ConnectionModel({
        fromUserId: user._id,
        toUserId: toUserId,
        status: status,
      });
      const data = await ConnectionRequest.save();
      res.json({
        message: `${user.firstName} - ${status} - ${searchUserID.firstName}`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("something went wrong " + err.message);
    }
  }
);

module.exports = requestsRouter;
