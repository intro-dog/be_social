const router = require("express").Router()
const postController = require("../controllers/postController")
const { protectRoute } = require("../middleware/protectRoute")

router.get("/all", protectRoute, postController.get_all_posts)
router.get("/likes/:id", protectRoute, postController.get_liked_posts)
router.get("/following", protectRoute, postController.get_following_posts)
router.get("/user/:username", protectRoute, postController.get_user_posts)
router.post("/create", protectRoute, postController.create_post)
router.post("/like/:id", protectRoute, postController.like_unlike_post)
router.post("/update/:id", protectRoute, postController.update_post)
router.post("/comment/:id", protectRoute, postController.comment_post)
router.delete("/delete/:id", protectRoute, postController.delete_post)

module.exports = router
