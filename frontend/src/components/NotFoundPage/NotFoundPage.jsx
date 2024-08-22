import React from "react"
import { Link } from "react-router-dom"
import "./notFound.style.css"
const NotFoundPage = () => {
  return (
    <div className="not-found__container">
      <div>
        <div className="oops">
          <img src="/oops.png" alt="oops image" />
        </div>
        <div className="not-found">
          <div className="cable"></div>
          <div className="not-found__img">
            <img src="/page_not_found.png" alt="Page not found" />
          </div>
        </div>
      </div>
      <div className="not-found__info">
        <Link className="not-found__link" to="/">
          Back home
        </Link>
        <div className="not-found__text">Page not found</div>
      </div>
    </div>
  )
}

export default NotFoundPage
