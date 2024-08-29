const router = require("express").Router()
const { protectRoute } = require("../middleware/protectRoute")
const notificationController = require("../controllers/notificationController")

router.get(
  "/notifications",
  protectRoute,
  notificationController.get_notifications
)
router.delete(
  "/notifications/delete",
  protectRoute,
  notificationController.delete_notifications
)

module.exports = router
