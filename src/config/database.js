const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = { connectDB };
// connectDB()
//   .then(() => console.log("Database connection established"))
//   .catch(() => console.log("Database cannot be connected"));
//   .finally(() => connectDB.close());
