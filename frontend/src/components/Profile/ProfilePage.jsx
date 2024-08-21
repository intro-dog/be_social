import React, { useEffect } from "react"
import {
  FaArrowLeft,
  FaCalendar,
  FaLink,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import { get_user_posts } from "../../store/reducers/postReducer"
import { get_user_profile } from "../../store/reducers/userReducer"
import { formatDate } from "./../../utils/formatDate/formatDate"
import Sidebar from "./../Sidebar/Sidebar"
import "./profile.style.css"
const ProfilePage = () => {
  const { user } = useSelector((state) => state.user)
  const { posts, isLoading } = useSelector((state) => state.post)
  const { username } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_user_profile(username))
  }, [])

  useEffect(() => {
    dispatch(get_user_posts(username))
  }, [])

  return (
    <>
      {isLoading && (
        <div className="spinner">
          <FadeLoader />
        </div>
      )}
      <Sidebar />
      <div className="profile">
        <div className="profile__content">
          <div className="profile__cover">
            <img src={user?.coverImg || "/cover.png"} alt="cover image" />
            <Link to="/" className="profile__back">
              <FaArrowLeft size={20} />
            </Link>
            <div className="profile__img">
              <img
                src={user?.profileImg || "/avatar-placeholder.png"}
                alt="profile image"
              />
            </div>

            <div className="profile__info profile__info--profile">
              <div className="profile__info__content">
                <span className="profile__title">{user?.fullName}</span>
                <span className="profile__subtitle">@{user?.username}</span>

                <span className="profile__bio">{user?.bio || "No bio"}</span>
                <div className="profile__info__details">
                  <div className="details__icons">
                    <FaLink size={14} />

                    <Link className="profile__link" to={`${user?.link}`}>
                      {user?.link || "No link"}
                    </Link>
                  </div>
                  <div className="details__icons">
                    <FaCalendar className="profile__date" />
                    <span className="profile__date">
                      Joined {formatDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="profile__info__stats">
                  <span>
                    <span className="profile__counter">{posts?.length}</span>{" "}
                    {posts?.length === 1 ? "Post" : "Posts"}
                  </span>
                  <span>
                    <span className="profile__counter">
                      {user?.following?.length}
                    </span>{" "}
                    Following
                  </span>
                  <span>
                    <span className="profile__counter">
                      {user?.followers?.length}
                    </span>{" "}
                    {user?.followers?.length === 1 ? "Follower" : "Followers"}
                  </span>
                </div>
              </div>
            </div>

            <hr />

            {/* POSTS */}

            <div className="profile__posts posts">
              {posts.length === 0 && (
                <span className="posts__empty">No posts yet</span>
              )}
              <div className="posts__content">
                {posts?.map((post, index) => (
                  <div className="content__items" key={index}>
                    <div className="posts__item">
                      <div className="posts__avatar">
                        <img
                          src={
                            post?.user?.profileImg || "/avatar-placeholder.png"
                          }
                          alt="posts avatar"
                        />
                      </div>
                      <div className="posts__info__content">
                        <div className="posts__info">
                          <div className="posts__info__header header__info">
                            <div className="header__info">
                              <Link
                                to={`/profile/${post?.user?.username}`}
                                className="posts__name underline"
                              >
                                {`${post?.user?.fullName} ⋅`}
                              </Link>
                              <span className="posts__username">
                                @{`${post?.user?.username} ⋅`}
                              </span>
                              <span className="posts__date">
                                {formatDate(post?.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="posts__text">
                            <span className="posts__text">{post?.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {post.img && (
                      <div className="posts__description__img">
                        <img src={post?.img} alt="post image" />
                      </div>
                    )}
                    <div className="posts__stats">
                      <div className="stats__info">
                        <FaRegComment size={15} />
                        <span>{post?.comments?.length}</span>
                      </div>
                      <div className="stats__info">
                        <FaRegHeart size={15} />
                        <span>{post?.likes?.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* POSTS */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
