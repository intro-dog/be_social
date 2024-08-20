import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa"
import {
  MdDriveFileRenameOutline,
  MdOutlineMail,
  MdPassword,
} from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import { messageClear, signup } from "../../store/reducers/authReducer"
import "./signup.style.css"

const SignUpPage = () => {
  const { isLoading, errorMessage, successMessage, userInfo } = useSelector(
    (state) => state.auth
  )
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(signup(formData))
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      navigate("/")
      dispatch(messageClear())
    }

    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
  }, [successMessage, errorMessage, userInfo])

  return (
    <div className="signup">
      {isLoading && (
        <div className="spinner">
          <FadeLoader />
        </div>
      )}
      <div className="signup__container">
        <div className="signup__img">
          <img src="/logo/logo.png" alt="logo" />
        </div>
        <div className="signup__form">
          <form onSubmit={handleSubmit} className="form">
            <h1 className="form__title">Join today.</h1>

            <label className="email" htmlFor="email">
              <MdOutlineMail size={25} />
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email.."
                onChange={handleInputChange}
                value={formData.email}
              />
            </label>

            <label className="username" htmlFor="username">
              <FaUser size={25} />
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                placeholder="Username.."
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>

            <label className="fullname" htmlFor="fullName">
              <MdDriveFileRenameOutline size={25} />
              <input
                type="text"
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder="Full Name.."
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>

            <label htmlFor="password" className="password">
              <MdPassword size={25} />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                id="password"
                name="password"
                placeholder="Password.."
                onChange={handleInputChange}
                value={formData.password}
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle-icon"
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </span>
            </label>

            <button className="form__btn">Sign Up</button>
            <div className="form__link">
              <p>Already have an account?</p>
              <Link to="/login" className="link">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
