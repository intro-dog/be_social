const Notification = require("../models/notificationModel")
const { responseReturn } = require("../util/response")

class notificationController {
  get_notifications = async (req, res) => {
    try {
      // Ensure that userId is retrieved from req.user
      const userId = req.user._id

      // Fetch notifications with filtering
      const notifications = await Notification.find({
        to: userId,
        $or: [
          { type: { $ne: "like" } }, // Exclude notifications of type 'like'
          { $expr: { $ne: ["$from", "$to"] } }, // Ensure that `from` is not equal to `to`
        ],
      }).populate({
        path: "from",
        select: "username profileImg",
      })

      // Mark notifications as read
      await Notification.updateMany({ to: userId }, { read: true })

      // Send response with notifications
      responseReturn(res, 200, notifications)
    } catch (error) {
      console.log("Error in getNotifications function", error.message)
      responseReturn(res, 500, { error: error.message })
    }
  }

  delete_notifications = async (req, res) => {
    try {
      const userId = req.user._id

      await Notification.deleteMany({ to: userId })

      responseReturn(res, 200, "Notifications deleted successfully")
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }
}

module.exports = new notificationController()
