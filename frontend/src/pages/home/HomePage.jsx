import React, { useEffect } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import Feed from "../../components/Feed/Feed"
import Sidebar from "../../components/Sidebar/Sidebar"
import { messageClear } from "../../store/reducers/authReducer"
import "./home.style.css"

const HomePage = () => {
  const { isLoading, errorMessage, successMessage, userInfo } = useSelector(
    (state) => state.auth
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
    }

    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (userInfo) {
      navigate("/")
    } else {
      navigate("/login")
    }
  }, [successMessage, errorMessage, userInfo])

  return (
    <>
      {isLoading && (
        <div className="spinner">
          <FadeLoader />
        </div>
      )}
      <Sidebar />
      <div className="home">
        <Feed />
      </div>
    </>
  )
}

export default HomePage
