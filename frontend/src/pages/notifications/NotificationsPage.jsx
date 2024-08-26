import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import { get_notifications } from "../../store/reducers/notificationsReducer"
import Sidebar from "./../../components/Sidebar/Sidebar"
import { formatDate } from "./../../utils/formatDate/formatDate"
import "./notifications.style.css"
const NotificationsPage = () => {
  const { isLoading, notifications } = useSelector(
    (state) => state.notifications
  )
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(get_notifications())
  }, [dispatch])

  return (
    <div>
      {isLoading && (
        <div className="spinner">
          <FadeLoader />
        </div>
      )}
      <Sidebar />
      <div className="notifications">
        <div className="notifications__content">
          <div className="notifications__header">
            <h2 className="notifications__title">Your notifications</h2>
            {/* <button>Delete all</button> */}
          </div>
          <div className="notifications__items">
            {notifications?.length === 0 && <p>No notifications</p>}

            {notifications?.map(
              (notification, index) =>
                notification.to?.toString() === user?._id?.toString() && (
                  <div className="notifications__item" key={index}>
                    <div className="notifications__item__img">
                      <img
                        src={
                          notification?.from?.profileImg ||
                          "/avatar-placeholder.png"
                        }
                        alt={notification?.from?.username}
                      />
                    </div>
                    <Link className="notifications__item__username">
                      {notification?.from?.username}
                    </Link>
                    {notification.type === "like" && (
                      <p className="notifications__item__text">
                        liked your photo.
                      </p>
                    )}
                    {notification.type === "follow" && (
                      <p className="notifications__item__text">
                        started following you.
                      </p>
                    )}
                    <span className="notifications__item__date">
                      {formatDate(notification?.createdAt)}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
