import axios from "axios"

const api = axios.create({
  // baseURL: "http://localhost:10000/api",
  baseURL: "https://be-social-9xj3.onrender.com/api",
  withCredentials: true,
})
export default api
