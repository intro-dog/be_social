import axios from "axios"

const api = axios.create({
  baseURL: "https://be-social-9xj3.onrender.com",
  // "http://localhost:10000/api" ||
  withCredentials: true,
})
export default api
