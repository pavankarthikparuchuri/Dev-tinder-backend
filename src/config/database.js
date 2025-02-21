const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pavankarthikparichuri2001:4eM2j805w09snKb5@namastenode.jwybp.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
// connectDB()
//   .then(() => console.log("Database connection established"))
//   .catch(() => console.log("Database cannot be connected"));
//   .finally(() => connectDB.close());
