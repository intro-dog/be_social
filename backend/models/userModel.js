const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: Schema.ObjectId,
        ref: "users",
        default: [],
      },
    ],
    following: [
      {
        type: Schema.ObjectId,
        ref: "users",
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [
      {
        type: Schema.ObjectId,
        ref: "posts",
        default: [],
      },
    ],
  },
  { timestamps: true }
)

module.exports = model("users", userSchema)
