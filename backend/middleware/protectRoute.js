const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

module.exports.protectRoute = async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return res.status(409).json({ error: "Please login to get access" })
  } else {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id)

      next()
    } catch (error) {
      console.log("error in protect", error)
      return res.status(409).json({ error: "Please login to get access" })
    }
  }
}
