var cron = require("node-cron");
const connectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { run } = require("./sendemail");
//This job will run in the morning everyday
cron.schedule("0 8 * * *", async () => {
  // send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingConnectionRequests = await connectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(pendingConnectionRequests.map((req) => req.toUserId.emailId)),
    ];
    for (const email of listOfEmails) {
      try {
        await run(
          "New Friend Requests Pending " + email,
          "There are so many friend requests pending, Please login to DevTinder.world and accept or reject those requests"
        );
      } catch (err) {
        console.log(err.message);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}); //cron-string, callback function
