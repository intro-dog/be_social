import authReducer from "./reducers/authReducer"
import postReducer from "./reducers/postReducer"
import userReducer from "./reducers/userReducer"

const rootReducer = {
  auth: authReducer,
  post: postReducer,
  user: userReducer,
}

export default rootReducer
