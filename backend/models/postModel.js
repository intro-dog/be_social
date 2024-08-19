const { Schema, model } = require("mongoose")

const postSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: Schema.ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: Schema.ObjectId,
          ref: "users",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

module.exports = model("posts", postSchema)
