const router = require("express").Router()
const authController = require("../controllers/authController")
const { protectRoute } = require("../middleware/protectRoute")

router.get("/me", protectRoute, authController.get_me)
router.post("/signup", authController.signup)
router.post("/login", authController.login)
router.post("/logout", authController.logout)

module.exports = router
