import React, { useState } from "react"
import { FaUser } from "react-icons/fa"
import { IoMdHome } from "react-icons/io"
import { IoMenu, IoNotifications } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../store/reducers/authReducer"
import "./sidebar.style.css"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const logoutHandler = async () => {
    await dispatch(logout())
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar__logo">
        <img src="/logo/logo.png" alt="logo" />
        <IoMenu className="sidebar__menu" size={35} onClick={toggleSidebar} />
      </div>

      <nav className="nav">
        <ul className="nav__list">
          <Link
            className={`nav__link ${isActive("/") ? "active" : ""} ${
              isOpen ? "navlink--mobile" : ""
            }`}
            to="/"
          >
            <IoMdHome size={20} />
            Home
          </Link>
          <Link
            className={`nav__link ${
              isActive(`/profile/${userInfo?.username}`) ? "active" : ""
            } ${isOpen ? "navlink--mobile" : ""}`}
            to={`/profile/${userInfo?.username}`}
          >
            <FaUser size={20} />
            Profile
          </Link>
          <Link
            className={`nav__link ${
              isActive("/notifications") ? "active" : ""
            } ${isOpen ? "navlink--mobile" : ""}`}
            to="/notifications"
          >
            <IoNotifications size={20} />
            Notifications
          </Link>
        </ul>
      </nav>
      <button
        className={`sidebar__logout ${isOpen ? "navlink--mobile" : ""}`}
        onClick={logoutHandler}
      >
        {userInfo && "Logout"}
      </button>
    </div>
  )
}

export default Sidebar
