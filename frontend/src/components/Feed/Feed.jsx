import React, { useEffect } from "react"
import { FaRegHeart } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { delete_post, get_all_posts } from "../../store/reducers/postReducer"
import { formatDate } from "../../utils/formatDate/formatDate"
import Comments from "../Comments/Comments"
import CreatePost from "../CreatePost/CreatePost"
import SuggestedPanel from "../SuggestedPanel/SuggestedPanel"
import "./feed.style.css"
const Feed = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const { posts } = useSelector((state) => state.post)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(get_all_posts())
  }, [])

  const handleDeletePost = async (postId) => {
    await dispatch(delete_post(postId))
  }

  return (
    <div className="feed">
      <SuggestedPanel />
      <CreatePost />

      <div className="profile__posts posts">
        <div className="posts__content">
          {posts.length === 0 && (
            <span className="posts__empty" key={0}>
              No posts yet
            </span>
          )}
          {posts?.map((post, index) => (
            <div className="content__items" key={index}>
              <div className="posts__item">
                <div className="posts__avatar">
                  <img
                    src={post?.user?.profileImg || "/avatar-placeholder.png"}
                    alt="posts avatar"
                  />
                </div>
                <div className="posts__info__content">
                  <div className="posts__info">
                    <div className="posts__info__header header__info">
                      <div className="header__info">
                        <Link
                          to={
                            userInfo?._id === post?.user?._id
                              ? `/me/${userInfo?.username}`
                              : `/profile/${post?.user?.username}`
                          }
                          className="posts__name underline"
                        >
                          {`${post?.user?.fullName} ⋅ `}
                        </Link>
                        <span className="posts__username">
                          @{`${post?.user?.username} ⋅ `}
                        </span>
                        <span className="posts__date">
                          {formatDate(post?.createdAt)}
                        </span>
                      </div>
                      {userInfo._id === post?.user?._id && (
                        <div className="posts__actions">
                          <MdDeleteOutline
                            size={20}
                            onClick={() => handleDeletePost(post?._id)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="posts__text">
                      <span className="posts__text">{post?.text}</span>
                    </div>
                  </div>
                </div>
              </div>
              {post?.img && (
                <div className="posts__description__img">
                  <img src={post?.img} alt="post image" />
                </div>
              )}
              <div className="posts__stats">
                <div className="stats__info">
                  <Comments post={post} userInfo={userInfo} />
                  <span className="counter">{post?.comments?.length}</span>
                </div>
                <div className="stats__info">
                  <FaRegHeart size={15} />
                  <span className="counter">{post?.likes?.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feed
