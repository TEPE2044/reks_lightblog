import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { ErrorLink } from "@apollo/client/link/error";
import { userStore } from "../Store/user";
// 旧版这个地方用的是CreateHttpLink，现在改成了HttpLink
const authLink = new HttpLink({
  uri: "http://localhost:12404/api/v1/gql",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

const headerMiddleWare = new ApolloLink((operation, forward) => {
  const rcode = localStorage.getItem("rcode");
  const payload = localStorage.getItem("payload");
  if (rcode && payload) {
    operation.setContext({
      headers:
        rcode && payload
          ? { Authorization: `Bearer ${rcode}`, "X-Payload": payload }
          : {},
    });
  }
  return forward(operation);
}); 

// ① GraphQL 业务错误（含 401）
// ② 纯网络异常（后端没启动、404、500 等）
const errorLink = new ErrorLink(({ graphQLErrors, networkError }: any) => {
 
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }: any) => {
      console.error(`[GraphQL error]: ${message}`);
      if (extensions?.code === "WHORU") {
        userStore().userLogout();
        alert("身份验证失败，请重新登录");
      }
    });
  }

  
  if (networkError) {
    const status = (networkError as any)?.statusCode;
    if (status === 0) alert("网络不通或服务未启动");
    else if (status === 404) alert("GraphQL 端点不存在");
    else if (status >= 500) alert("服务器内部错误");
  }
});

// Create the apollo client
const regpl = new ApolloClient({
  link: ApolloLink.from([headerMiddleWare, errorLink, authLink]),
  cache: new InMemoryCache(),
});

export default regpl;
