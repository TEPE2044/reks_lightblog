import axios from "axios";

const reapi = axios.create({
  baseURL: "http://localhost:10404/api/v1/",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default reapi;
