const mongoose = require("mongoose")

const dbConnect = () => {
  const uri = process.env.DB_URL
  if (!uri) {
    console.error("DB_URL is not defined in the environment environment")
    process.exit(1)
  }
  mongoose
    .connect(uri)
    .then(() => console.log("Successful connection to the database"))
    .catch((err) => console.error("Database connection error:", err))
}

module.exports = { dbConnect }
