import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { CiImageOn } from "react-icons/ci"
import { IoCloseSharp } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import { create_post, messageClear } from "../../store/reducers/postReducer"
import Emoji from "../Emoji/Emoji"
import "./createpost.style.css"

const CreatePost = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const { errorMessage, successMessage, isLoading } = useSelector(
    (state) => state.post
  )
  const dispatch = useDispatch()
  const [data, setData] = useState({
    text: "",
    img: "",
  })

  const imgRef = useRef(null)

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (successMessage) {
      toast.success(successMessage)
      setData({ text: "", img: "" })
      dispatch(messageClear())
    }
  }, [errorMessage, successMessage, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(create_post(data))
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setData((prevData) => ({
          ...prevData,
          img: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addEmojiToText = (emoji) => {
    setData((prevData) => ({ ...prevData, text: prevData.text + emoji }))
  }

  return (
    <div className="create-post">
      <div className="create-post__avatar">
        <img
          src={userInfo.profileImg || "/avatar-placeholder.png"}
          alt="avatar"
        />
      </div>
      <div className="create-post__content">
        <form className="create-post__form" onSubmit={handleSubmit}>
          <textarea
            className="create-post__textarea"
            placeholder="What's on your mind?"
            value={data.text}
            rows="5"
            onChange={(e) =>
              setData((prevData) => ({ ...prevData, text: e.target.value }))
            }
          />
          {data.img && (
            <div className="create-post__img">
              <IoCloseSharp
                className="create-post__icon"
                onClick={() => {
                  setData((prevData) => ({ ...prevData, img: "" }))
                  imgRef.current.value = null
                }}
              />
              <img src={data.img} alt="uploaded" />
            </div>
          )}

          <div className="create-post__actions">
            <div className="actions__icons">
              <div className="actions__icon">
                <CiImageOn size={20} onClick={() => imgRef.current.click()} />
              </div>
              <div className="emoji">
                <Emoji addEmojiToText={addEmojiToText} />
              </div>
            </div>
            <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
            <button className="button">
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
