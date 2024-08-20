import React, { useEffect, useRef, useState } from "react"
import { FaRegSmile } from "react-icons/fa"
import { animals, faces, symbols } from "../../utils/emojis/emoji"

const Emoji = ({ addEmojiToText }) => {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef(null)
  const iconRef = useRef(null)

  const handleEmojiClick = (emoji) => {
    addEmojiToText(emoji)
  }

  const handleClickOutside = (event) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target) &&
      iconRef.current &&
      !iconRef.current.contains(event.target)
    ) {
      setShowPicker(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const togglePicker = (event) => {
    event.stopPropagation()
    setShowPicker((prevState) => !prevState)
  }

  return (
    <div className="emoji__icon" ref={iconRef}>
      <FaRegSmile size={20} onClick={togglePicker} />
      {showPicker && (
        <div className="emoji__picker" ref={pickerRef}>
          <div className="emoji__items">
            {faces.concat(symbols, animals).map((emoji, index) => (
              <span onClick={() => handleEmojiClick(emoji.text)} key={index}>
                {emoji.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Emoji
