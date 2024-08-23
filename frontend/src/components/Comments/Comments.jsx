import React, { useState } from "react"
import { AiTwotoneCloseCircle } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import { Link } from "react-router-dom"
import "./comments.style.css"
const Comments = ({ post, userInfo }) => {
  const [comment, setComment] = useState("")
  console.log("post", post)

  const isCommenting = userInfo._id === post.user._id
  const openModal = () => {
    document.getElementById(`comments_modal${post._id}`).showModal()
    console.log(post._id)
    document.body.classList.add("modal-open")
  }

  const closeModal = () => {
    document.getElementById(`comments_modal${post._id}`).close()
    document.body.classList.remove("modal-open")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <div className="comments">
        <FaRegComment
          className="comments__icon"
          size={15}
          onClick={openModal}
        />
      </div>

      <dialog id={`comments_modal${post._id}`} className="comments__modal">
        <div className="comments__modal__content">
          <div className="comments__modal__header">
            <h3 className="comments__modal__title">Comments</h3>

            <form method="dialog" className="comments__modal__close">
              <AiTwotoneCloseCircle
                className="comments__modal__close__icon"
                size={20}
                onClick={closeModal}
              />
            </form>
          </div>

          {post?.comments?.length === 0 && (
            <span className="comments__modal__empty">
              No comments yet. Feel free to leave your first one😉
            </span>
          )}

          {post?.comments?.map((comment, index) => (
            <div className="comments__modal__item" key={index}>
              <div className="comments__modal__avatar">
                <img
                  className="comments__modal__img"
                  src={comment?.user?.profileImg || "/avatar-placeholder.png"}
                  alt={comment?.comments?.user?.username}
                />
              </div>

              <div className="comments__modal__info">
                <Link
                  to={`/profile/${comment?.user?.username}`}
                  className="comments__modal__name"
                >
                  {comment?.user?.fullName}
                </Link>
                <span className="comments__modal__username">
                  @{comment?.user?.username}
                </span>
                <p className="comments__modal__text">{comment?.text}</p>
              </div>
            </div>
          ))}

          <div className="comments__modal__body">
            <form className="comments__modal__form" onSubmit={handleSubmit}>
              <textarea
                className="comments__modal__textarea"
                placeholder="Add a comment..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                className={
                  isCommenting
                    ? "comments__modal__submit--disabled"
                    : "comments__modal__submit"
                }
                disabled={isCommenting}
              >
                Comment
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default Comments
