const User = require("../models/userModel")
const cloudinary = require("cloudinary").v2
const { responseReturn } = require("../util/response")
const Notification = require("../models/notificationModel")
const bcrypt = require("bcrypt")

class userController {
  get_user_profile = async (req, res) => {
    try {
      const { username } = req.params
      const user = await User.findOne({ username }).select("-password")
      if (!user) {
        return responseReturn(res, 404, {
          error: "User not found",
        })
      }
      return responseReturn(res, 200, user)
    } catch (error) {
      return responseReturn(res, 500, { error: error.message })
    }
  }

  get_suggested_users = async (req, res) => {
    try {
      const userId = req.user._id

      const usersFollowedByMe = await User.findById(userId).select("following")

      const users = await User.aggregate([
        {
          $match: {
            _id: { $ne: userId },
          },
        },
        {
          $sample: {
            size: 5,
          },
        },
      ])

      const filteredUsers = users.filter(
        (user) => !usersFollowedByMe.following.includes(user._id)
      )

      const suggestedUsers = filteredUsers.slice(0, 4)

      suggestedUsers.forEach((user) => (user.password = null))

      return responseReturn(res, 200, suggestedUsers)
    } catch (error) {
      console.log("error in get_suggested_users", error)
      return responseReturn(res, 500, { error: error.message })
    }
  }

  follow_unfollow_user = async (req, res) => {
    try {
      const { id } = req.params
      const userToModify = await User.findById(id)
      const currentUser = await User.findById(req.user._id)

      if (id === req.user._id.toString()) {
        return responseReturn(res, 400, {
          error: "You can't follow yourself",
        })
      }

      if (!userToModify || !currentUser) {
        return responseReturn(res, 404, {
          error: "User not found",
        })
      }

      const isFollowing = userToModify.followers.includes(req.user._id)

      if (isFollowing) {
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })

        // send notification
        const newNotification = new Notification({
          type: "unfollow",
          from: req.user._id,
          to: userToModify._id,
        })
        await newNotification.save()

        return responseReturn(res, 200, {
          message: "Unfollowed successfully",
        })
      } else {
        await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
        await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
        // send notification
        const newNotification = new Notification({
          type: "follow",
          from: req.user._id,
          to: userToModify._id,
        })
        await newNotification.save()

        return responseReturn(res, 200, {
          message: "Followed successfully",
        })
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  update_user_profile = async (req, res) => {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body
    let { profileImg, coverImg } = req.body

    const userId = req.user._id
    try {
      let user = await User.findById(userId)
      if (!user) {
        return responseReturn(res, 404, {
          error: "User not found",
        })
      }

      if (
        (!newPassword && currentPassword) ||
        (!currentPassword && newPassword)
      ) {
        return responseReturn(res, 400, {
          error: "Please provide both current password and new password",
        })
      }

      if (newPassword && currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
          return responseReturn(res, 400, {
            error: "Current password is incorrect",
          })
        }
        if (newPassword.length < 6) {
          return responseReturn(res, 400, {
            error: "Password must be at least 6 characters",
          })
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
      }

      if (profileImg) {
        if (user.profileImg) {
          await cloudinary.uploader.destroy(
            user.profileImg.split("/").pop().split(".")[0]
          )
        }

        const uploadedResponse = await cloudinary.uploader.upload(profileImg)
        profileImg = uploadedResponse.secure_url
      }

      if (coverImg) {
        if (user.coverImg) {
          await cloudinary.uploader.destroy(
            user.coverImg.split("/").pop().split(".")[0]
          )
        }

        const uploadedResponse = await cloudinary.uploader.upload(coverImg)
        coverImg = uploadedResponse.secure_url
      }

      user.fullName = fullName || user.fullName
      user.email = email || user.email
      user.username = username || user.username
      user.bio = bio || user.bio
      user.link = link || user.link
      user.profileImg = profileImg || user.profileImg
      user.coverImg = coverImg || user.coverImg

      user = await user.save()
      user.password = null

      return responseReturn(res, 200, user)
    } catch (error) {
      return responseReturn(res, 500, { error: error.message })
    }
  }
}

module.exports = new userController()
