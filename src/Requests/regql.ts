import axios from "axios";
import { userStore } from "../Store/user";

const regql = axios.create({
    baseURL: "http://localhost:12404/api/v1/gql",
    timeout: 15000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

regql.interceptors.request.use(config => {
  const rcode = localStorage.getItem("rcode");
  const payload = localStorage.getItem("payload");
  if (rcode && payload) {
    config.headers["Authorization"] = `Bearer ${rcode}`;
    config.headers["X-Payload"] = payload;
  }
  return config;
})

regql.interceptors.response.use(
    res => res,
    err => {
        if(err.response.status === 401) {
            const user = userStore();
            user.userLogout();
            alert("身份验证失败，请重新登录");
        }
        return Promise.reject(err);
    }
)

export default regql;