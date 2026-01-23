import axios from "axios";
import { userStore } from "../Store/user";


const reapi = axios.create({
  baseURL: "https://v1.rekindlers.top/api/v1/",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// 请求拦截器
reapi.interceptors.request.use(config => {
  const rcode = localStorage.getItem("rcode");
  const payload = localStorage.getItem("payload");
  if (rcode && payload) {
    config.headers["Authorization"] = `Bearer ${rcode}`;
    config.headers["X-Payload"] = payload;
  }
  return config;
})


// 响应拦截器
reapi.interceptors.response.use(
  res => res,
  async err => {
    if(err.response.status === 401) {
      const user = userStore();
      user.userLogout();
      alert("身份验证失败，请重新登录");
    }
    return Promise.reject(err);
  }
)
export default reapi;