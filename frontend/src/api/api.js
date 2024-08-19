import axios from "axios"

const api = axios.create({
  baseURL:
    // "https://be-social-y14j.onrender.com/api" ||
    "http://localhost:10000/api",
  withCredentials: true,
})
export default api
