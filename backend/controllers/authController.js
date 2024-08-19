const userModel = require("../models/userModel")
const { createToken } = require("../util/createToken")
const { responseReturn } = require("../util/response")
const bcrypt = require("bcrypt")

class authController {
  signup = async (req, res) => {
    const { email, fullName, password, username } = req.body
    try {
      const userEmail = await userModel.findOne({ email })
      const userName = await userModel.findOne({ username })

      if (!email) {
        return responseReturn(res, 400, { error: "Email is required" })
      }

      if (!username) {
        return responseReturn(res, 400, { error: "Username is required" })
      }

      if (!fullName) {
        return responseReturn(res, 400, { error: "Fullname is required" })
      }

      if (!password) {
        return responseReturn(res, 400, { error: "Password is required" })
      }

      if (password.length < 6) {
        return responseReturn(res, 400, {
          error: "Password must be at least 6 characters",
        })
      }

      // Регулярний вираз для перевірки пароля (лише букви та цифри)
      const passwordRegex = /^[A-Za-z0-9]+$/
      if (!passwordRegex.test(password)) {
        return responseReturn(res, 400, {
          error: "Password must contain only letters and numbers",
        })
      }

      if (userEmail) {
        return responseReturn(res, 404, { error: "Email already exists" })
      }

      if (userName) {
        return responseReturn(res, 404, { error: "Username already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await userModel.create({
        fullName,
        email,
        username,
        password: hashedPassword,
      })

      const token = await createToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName,
        followers: newUser.followers,
        following: newUser.following,
        coverImg: newUser.coverImg,
        profileImg: newUser.profileImg,
        link: newUser.link,
        bio: newUser.bio,
        likedPosts: newUser.likedPosts,
      })

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      responseReturn(res, 201, { token, message: "Register Success" })
    } catch (error) {
      console.log("error in signup", error)
      responseReturn(res, 500, { error: "Internal Server Error" })
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body

      const user = await userModel
        .findOne({ email })
        .select("+password")
        .select("+createdAt")
        .select("+updatedAt")

      const isMatch = await bcrypt.compare(password, user?.password || "")

      if (!user) {
        return responseReturn(res, 400, { error: "Invalid email" })
      }
      if (!isMatch) {
        return responseReturn(res, 400, { error: "Invalid password" })
      }

      const token = await createToken({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
        likedPosts: user.likedPosts,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      responseReturn(res, 200, {
        token,
        message: "User login successfully",
      })
    } catch (error) {
      console.log("Error in login function", error)
      responseReturn(res, 500, error.message)
    }
  }

  logout = async (req, res) => {
    res.cookie("token", "", {
      expires: new Date(Date.now()),
    })
    responseReturn(res, 200, { message: "Logout Success" })
  }

  get_me = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id).select("-password")
      responseReturn(res, 200, user)
    } catch (error) {
      console.log("Error in getMe function", error)
      responseReturn(res, 500, error.message)
    }
  }
}

module.exports = new authController()
