import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { like_unlike_post } from "../../store/reducers/postReducer"

const LikeButton = ({ post }) => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const updatedPost = useSelector((state) =>
    state.post.posts.find((p) => p._id === post._id)
  )

  const liked = updatedPost?.likes?.includes(userInfo._id)

  const handleLikeClick = () => {
    dispatch(like_unlike_post(post._id))
  }

  return (
    <div className="stats__info">
      {liked ? (
        <FaHeart size={15} color="red" onClick={handleLikeClick} />
      ) : (
        <FaRegHeart size={15} onClick={handleLikeClick} />
      )}
      <span className="counter">{updatedPost?.likes?.length || 0}</span>
    </div>
  )
}

export default LikeButton
