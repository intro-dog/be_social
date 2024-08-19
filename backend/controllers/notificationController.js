const Notification = require("../models/notificationModel")
const User = require("../models/userModel")
const { responseReturn } = require("../util/response")

class notificationController {
  get_notifications = async (req, res) => {
    try {
      const userId = req.user._id

      const notifications = await Notification.find({ to: userId }).populate({
        path: "from",
        select: "username profileImg",
      })

      await Notification.updateMany({ to: userId }, { read: true })

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
