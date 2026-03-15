import { createClient } from "graphql-ws";
import { userStore } from "../Store/user";
import router from "../Router";


// 启动 graph-ws
export const wsClient = createClient({
  // url: "ws://localhost:12404/api/v1/gql/subql",
  // 正式环境
  url: "wss://v1.rekindlers.top/api/v1/gql/subql",
  shouldRetry: () => true,
  connectionParams: () => getAuthHeaders()
});

// 获取
const getAuthHeaders = () => {
  const rcode = localStorage.getItem("rcode")
  const payload = localStorage.getItem("payload");
  
  if(!rcode && !payload)
  {
    const user = userStore();
    user.userLogout();
    router.replace('/')
    return
  }
  return {
    Authorization: rcode ? `Bearer ${rcode}` : "",
    "X-Payload": payload || '',
  };
};