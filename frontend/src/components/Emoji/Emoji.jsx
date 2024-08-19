import React, { useState } from "react"
import { FaRegSmile } from "react-icons/fa"

const Emoji = ({ addEmojiToText }) => {
  const [showPicker, setShowPicker] = useState(false)

  const handleEmojiClick = (emoji) => {
    addEmojiToText(emoji)
    setShowPicker(false)
  }

  return (
    <div className="emoji__icon">
      <FaRegSmile size={20} onClick={() => setShowPicker(!showPicker)} />
      {showPicker && (
        <div className="emoji__picker">
          <div className="emoji__items">
            <span onClick={() => handleEmojiClick("😊")}>😊</span>
            <span onClick={() => handleEmojiClick("😂")}>😂</span>
            <span onClick={() => handleEmojiClick("😍")}>😍</span>
            <span onClick={() => handleEmojiClick("😇")}>😇</span>
            <span onClick={() => handleEmojiClick("🥹")}>🥹</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emoji
