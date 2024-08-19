import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { get_suggested_users } from "../../store/reducers/userReducer"
import "./suggested.style.css"

const SuggestedPanel = () => {
  const { isLoading, users } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(get_suggested_users())
  }, [dispatch])

  return (
    <div className="suggest">
      <h2 className="suggest__title">Who to follow</h2>
      <div className="suggest__content content">
        {isLoading && <p>Loading...</p>}

        {!isLoading && users.length === 0 && <p>No users to follow</p>}

        {!isLoading &&
          users.length > 0 &&
          users.map((user) => (
            <Link to={`/profile/${user.username}`} key={user._id}>
              <div className="content__item">
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

                <button className="button">Follow</button>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default SuggestedPanel
