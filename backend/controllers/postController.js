const Post = require("../models/postModel")
const User = require("../models/userModel")
const Notification = require("../models/notificationModel")
const { responseReturn } = require("../util/response")
const { json } = require("body-parser")
const cloudinary = require("cloudinary").v2
const mongoose = require("mongoose")

class postController {
  get_all_posts = async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
        .populate({
          path: "comments.user",
          select: "-password",
        })
      if (posts.length === 0) {
        return responseReturn(res, 200, [])
      }

      responseReturn(res, 200, posts)
    } catch (error) {
      console.log("Error in get_all_posts function", error)
      responseReturn(res, 500, { error: error })
    }
  }

  get_liked_posts = async (req, res) => {
    const userId = req.params.id
    try {
      const user = await User.findById(userId)
      if (!user) {
        return responseReturn(res, 404, { error: "User not found" })
      }

      const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate({
          path: "user",
          select: "-password",
        })
        .populate({
          path: "comments.user",
          select: "-password",
        })

      responseReturn(res, 200, likedPosts)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  get_following_posts = async (req, res) => {
    try {
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) return responseReturn(res, 404, { error: "User not found" })

      const following = user.following

      const feedPosts = await Post.find({ user: { $in: following } })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
        .populate({
          path: "comments.user",
          select: "-password",
        })

      responseReturn(res, 200, feedPosts)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  get_user_posts = async (req, res) => {
    try {
      const { username } = req.params

      const user = await User.findOne({ username })
      if (!user) return responseReturn(res, 404, { error: "User not found" })

      const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
        .populate({
          path: "comments.user",
          select: "-password",
        })

      responseReturn(res, 200, posts)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  create_post = async (req, res) => {
    try {
      const { text } = req.body
      let { img } = req.body
      const userId = req.user._id
      const user = await User.findById(userId)

      if (!user) {
        return responseReturn(res, 404, { error: "User not found" })
      }

      if (!text && !img) {
        return responseReturn(res, 400, {
          error: "Post must have text or image",
        })
      }

      if (img) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(img)
          img = uploadedResponse.secure_url
        } catch (uploadError) {
          if (uploadError.http_code === 413) {
            return responseReturn(res, 413, {
              error: "Image file size is too large",
            })
          }
          return responseReturn(res, 500, { error: "Error uploading image" })
        }
      }

      const newPost = new Post({
        user: user,
        username: user.username,
        fullName: user.fullName,
        text,
        img,
      })

      await newPost.save()
      responseReturn(res, 201, newPost)
    } catch (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return responseReturn(res, 413, { error: "File size is too large" })
      }
      console.log("Error in create_post function", error)
      responseReturn(res, 500, { error: error.message })
    }
  }

  delete_post = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      if (!post) {
        return responseReturn(res, 404, { error: "Post not found" })
      }

      if (post.user.toString() !== req.user._id.toString()) {
        return responseReturn(res, 401, {
          error: "You are not authorized to delete post",
        })
      }

      if (post.img) {
        const imgId = post.img.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(imgId)
      }

      await Post.findByIdAndDelete(req.params.id)

      responseReturn(res, 200, post)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  update_post = async (req, res) => {
    try {
      let { text, img } = req.body
      const post = await Post.findById(req.params.id)

      if (!post) {
        return responseReturn(res, 404, { error: "Post not found" })
      }

      if (post.user.toString() !== req.user._id.toString()) {
        return responseReturn(res, 401, {
          error: "You are not authorized to update post",
        })
      }

      if (!text && !img) {
        return responseReturn(res, 400, {
          error: "Post must have text or image",
        })
      }

      if (img) {
        if (post.img) {
          await cloudinary.uploader.destroy(
            post.profileImg.split("/").pop().split(".")[0]
          )
        }

        const uploadedResponse = await cloudinary.uploader.upload(img)
        img = uploadedResponse.secure_url
      }

      post.text = text || post.text
      post.img = img || post.img
      await post.save()
      responseReturn(res, 200, post)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  comment_post = async (req, res) => {
    try {
      const { text } = req.body
      const postId = req.params.id
      const userId = req.user._id
      const post = await Post.findById(postId)

      if (!text) {
        return responseReturn(res, 400, { error: "Text is required" })
      }

      if (!post) {
        return responseReturn(res, 404, { error: "Post not found" })
      }

      const newComment = {
        user: userId,
        text,
      }
      post.comments.push(newComment)
      await post.save()

      const updatedPost = await Post.findById(postId).populate("comments.user")

      responseReturn(res, 201, updatedPost)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  delete_comment = async (req, res) => {
    try {
      const { postId, commentId } = req.params

      if (
        !mongoose.Types.ObjectId.isValid(postId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
      ) {
        return responseReturn(res, 400, { error: "Invalid post or comment ID" })
      }

      const post = await Post.findById(postId).populate("comments.user")
      if (!post) {
        return responseReturn(res, 404, { error: "Post not found" })
      }

      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === commentId
      )
      if (commentIndex === -1) {
        return responseReturn(res, 404, { error: "Comment not found" })
      }

      post.comments.splice(commentIndex, 1)
      await post.save()

      responseReturn(res, 200, post)
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }

  like_unlike_post = async (req, res) => {
    try {
      const userId = req.user._id
      const { id: postId } = req.params

      const post = await Post.findById(postId)

      if (!post) {
        return responseReturn(res, 404, { error: "Post not found" })
      }

      const userLikedPost = post.likes.includes(userId)

      if (userLikedPost) {
        // Unlike post
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
        await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })

        const updatedLikes = post.likes.filter(
          (id) => id.toString() !== userId.toString()
        )
        responseReturn(res, 200, updatedLikes)
      } else {
        // Like post
        post.likes.push(userId)
        await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
        await post.save()

        const notification = new Notification({
          from: userId,
          to: post.user,
          type: "like",
        })
        await notification.save()

        const updatedLikes = post.likes
        responseReturn(res, 200, updatedLikes)
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message })
    }
  }
}

module.exports = new postController()
