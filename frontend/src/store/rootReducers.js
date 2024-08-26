import authReducer from "./reducers/authReducer"
import notificationsReducer from "./reducers/notificationsReducer"
import postReducer from "./reducers/postReducer"
import userReducer from "./reducers/userReducer"

const rootReducer = {
  auth: authReducer,
  post: postReducer,
  user: userReducer,
  notifications: notificationsReducer,
}

export default rootReducer
