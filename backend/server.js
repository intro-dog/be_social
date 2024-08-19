const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const { dbConnect } = require("./util/db")
const cloudinary = require("cloudinary").v2

// this command adds our hidden constants from .env to process.env
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(
  cors({
    origin: ["https://be-social-y14j.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
)

app.use((err, req, res, next) => {
  console.error(err.stack) // Log the error stack
  if (err.status === 413) {
    res.status(413).send("Payload too large")
  } else {
    res.status(err.status || 500).send(err.message || "Internal Server Error")
  }
})

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api", require("./routes/authRoutes"))
app.use("/api", require("./routes/userRoutes"))
app.use("/api", require("./routes/postRoutes"))
app.use("/api", require("./routes/notificationRoutes"))

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  dbConnect()
})
