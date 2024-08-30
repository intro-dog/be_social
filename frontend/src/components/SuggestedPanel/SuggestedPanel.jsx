import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useSwipeable } from "react-swipeable"
import {
  clearMessage,
  follow_user,
  get_suggested_users,
} from "../../store/reducers/userReducer"
import "./suggested.style.css"

const SuggestedPanel = () => {
  const {
    isLoading,
    users: suggestedUsers,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(get_suggested_users())
  }, [dispatch])

  useEffect(() => {
    setUsers(suggestedUsers)
  }, [suggestedUsers])

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(clearMessage())
    }

    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(clearMessage())
    }
  }, [successMessage, errorMessage, dispatch])

  const handleSwipe = (direction) => {
    const container = document.querySelector(".suggest__content")
    if (direction === "left") {
      container.scrollBy({ left: 300, behavior: "smooth" })
    } else if (direction === "right") {
      container.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const handleFollowUser = (userId) => {
    dispatch(follow_user(userId)).then(() => {
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId))
    })
  }

  return (
    <div className="suggest" {...handlers}>
      <h2 className="suggest__title">Who to follow</h2>
      <div className="suggest__content content">
        {isLoading && <p>Loading...</p>}

        {!isLoading && users.length === 0 && <p>No users to follow</p>}

        {!isLoading &&
          users.length > 0 &&
          users.map((user) => (
            <div key={user._id} className="content__item">
              <Link
                to={`/profile/${user.username}`}
                className="content__item__description"
              >
                <img
                  src={user.profileImg || "/avatar-placeholder.png"}
                  alt={user.username}
                />
                <span className="description__content__title">
                  {user.fullName}
                </span>
                <span className="description__content__subtitle">
                  @{user.username}
                </span>
              </Link>
              <button
                className="suggest__btn"
                onClick={() => handleFollowUser(user._id)}
              >
                Follow
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default SuggestedPanel
