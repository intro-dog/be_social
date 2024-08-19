const { protectRoute } = require("../middleware/protectRoute")
const userController = require("../controllers/userController")
const router = require("express").Router()

router.get("/profile/:username", protectRoute, userController.get_user_profile)
router.get("/suggested", protectRoute, userController.get_suggested_users)
router.post("/follow/:id", protectRoute, userController.follow_unfollow_user)
router.post("/update", protectRoute, userController.update_user_profile)

module.exports = router
