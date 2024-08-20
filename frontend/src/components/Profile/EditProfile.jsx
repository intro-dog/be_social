import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { IoMdCloseCircle } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"
import { messageClear } from "../../store/reducers/postReducer"
import { update_user } from "./../../store/reducers/authReducer"
import { formatDate } from "./../../utils/formatDate/formatDate"

import "./editProfile.style.css"
const EditProfile = ({ user }) => {
  const { isUpdating, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  })

  const [initialFormData, setInitialFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(update_user(formData))
  }

  useEffect(() => {
    if (user) {
      const initialData = {
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        link: user.link || "",
        newPassword: "",
        currentPassword: "",
      }
      setFormData(initialData)
      setInitialFormData(initialData)
    }
  }, [user])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      closeModal()
      dispatch(messageClear())
    }
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
  }, [successMessage, errorMessage])
  const openModal = () => {
    document.getElementById("edit__profile_modal").showModal()
    document.body.classList.add("modal-open")
  }

  const closeModal = () => {
    document.getElementById("edit__profile_modal").close()
    document.body.classList.remove("modal-open")
    setFormData(initialFormData)
  }

  return (
    <>
      <button className="edit__profile--btn" onClick={openModal}>
        Edit profile
      </button>

      <dialog id="edit__profile_modal" className="edit__profile__modal">
        <div className="edit__profile__modal__content">
          <div className="edit__profile__modal__header">
            <div className="edit__profile__modal__title edit__title">
              <h3 className="edit__profile__title">Update your profile</h3>
              <span className="edit__profile__updatedAd">
                last update {formatDate(user?.updatedAt)}
              </span>
            </div>
            <form method="dialog" className="modal__close">
              <IoMdCloseCircle
                className="close__icon"
                size={20}
                onClick={closeModal}
              />
            </form>
          </div>
          <form
            className="edit__profile__modal__form edit__form"
            onSubmit={handleSubmit}
          >
            <div className="edit__form__items">
              <div className="items__name">
                <label htmlFor="fullName" className="label__fullname">
                  Fullname
                  <input
                    id="fullName"
                    className="edit__form__fullname"
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </label>
                <label htmlFor="username" className="label__username">
                  Username
                  <input
                    id="username"
                    className="edit__form__username"
                    autoComplete="username"
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <label htmlFor="email" className="label__email">
                Email
                <input
                  id="email"
                  className="edit__form__email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <div className="items__description">
                <label htmlFor="bio" className="label__bio">
                  Bio
                  <input
                    id="bio"
                    className="edit__form__bio"
                    type="text"
                    placeholder="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </label>
                <label htmlFor="link" className="label__link">
                  Link
                  <input
                    id="link"
                    className="edit__form__link"
                    type="text"
                    placeholder="Link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="items__password">
                <input
                  id="currentPassword"
                  className="edit__form__password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Current Password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />

                <input
                  id="newPassword"
                  className="edit__form__password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>

              <button className="edit__form__btn">
                {isUpdating ? "Loading..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default EditProfile
