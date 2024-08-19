import React, { useEffect, useRef, useState } from "react"
import {
  FaArrowLeft,
  FaCalendar,
  FaLink,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa"
import { MdDeleteOutline, MdEdit } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import { get_user_posts } from "../../store/reducers/postReducer"
import { get_user_profile } from "../../store/reducers/userReducer"
import { formatDate } from "./../../utils/formatDate/formatDate"
import Sidebar from "./../Sidebar/Sidebar"
import "./profile.style.css"
const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null)
  const coverImgRef = useRef(null)
  const [profileImg, setProfileImg] = useState(null)
  const profileImgRef = useRef(null)

  const { userInfo } = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user.user)
  const { posts, isLoading } = useSelector((state) => state.post)
  const { username } = useParams()
  const dispatch = useDispatch()

  const isMyProfile = username === userInfo?.username

  const handleImgChange = (e, state) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (state === "coverImg") setCoverImg(reader.result)
        if (state === "profileImg") setProfileImg(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

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
            <img
              src={coverImg || user?.coverImg || "/cover.png"}
              alt="cover image"
            />
            <Link to="/" className="profile__back">
              <FaArrowLeft size={20} />
            </Link>
            {isMyProfile && (
              <MdEdit
                className="cover__edit"
                size={30}
                onClick={() => coverImgRef.current.click()}
              />
            )}

            <input
              className="cover__input"
              type="file"
              hidden
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              className="profile__input"
              type="file"
              hidden
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />
          </div>

          <div className="profile__img">
            <img
              src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
              alt="profile image"
            />
            {isMyProfile && (
              <div className="profile__overlay">
                <MdEdit
                  className="profile__edit"
                  size={30}
                  onClick={() => profileImgRef.current.click()}
                />
              </div>
            )}
          </div>

          <div className="profile__info">
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
                    {user?.following.length}
                  </span>{" "}
                  Following
                </span>
                <span>
                  <span className="profile__counter">
                    {user?.followers.length}
                  </span>{" "}
                  {user?.followers.length === 1 ? "Follower" : "Followers"}
                </span>
              </div>
            </div>
            <div className="profile__info__actions">
              <button className="button">
                {isMyProfile ? "Edit profile" : "Follow"}
              </button>
              {(coverImg || profileImg) && (
                <button
                  className="button button--secondary"
                  onClick={() => alert("Profile updated successfully")}
                >
                  Update
                </button>
              )}
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
                          {userInfo.id === post?.user?._id && (
                            <div className="posts__actions">
                              <MdDeleteOutline size={20} />
                            </div>
                          )}
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
    </>
  )
}

export default ProfilePage
