import { useSelector } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { FadeLoader } from "react-spinners"
import "./App.css"
import ProfilePage from "./components/Profile/ProfilePage"
import HomePage from "./pages/home/HomePage"
import LoginPage from "./pages/login/LoginPage"
import MyProfiile from "./pages/me/MyProfile"
import NotificationsPage from "./pages/notifications/NotificationsPage"
import SignUpPage from "./pages/signup/SignUpPage"
function App() {
  const { isLoading } = useSelector((state) => state.auth)

  return (
    <BrowserRouter>
      {isLoading && (
        <div className="spinner">
          <FadeLoader />
        </div>
      )}
      <Routes>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/me/:username" element={<MyProfiile />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
