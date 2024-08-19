import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { MdOutlineMail, MdPassword } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import { login, messageClear } from "../../store/reducers/authReducer"
import "./login.style.css"
const LoginPage = () => {
  const { isLoading, errorMessage, successMessage, userInfo } = useSelector(
    (state) => state.auth
  )
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
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
    dispatch(login(formData))
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
            <h1 className="form__title">{"Let's go"}</h1>

            <label htmlFor="email" className="email">
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

            <button type="submit">Login</button>
            <div className="form__link">
              <p>Already have an account?</p>
              <Link to="/signup" className="link">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
