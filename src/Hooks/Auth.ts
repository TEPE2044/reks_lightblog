import reapi from "../Requests/reapi";
import type { AccountData, PhoneData } from "../Utils/reks-interface";

// 发送验证码
export const getCode = async (phone: string, codeActive: boolean) => {
  const code_res = await reapi({
    method: "POST",
    url: "/auth/send-sms-code",
    data: {
      phone: phone,
      codeActive: codeActive,
    },
  });
  return code_res;
};
// 手机号登录
export const loginbyPhone = async (data: PhoneData) => {
  const res = await reapi({
    method: "POST",
    url: "/auth/login-by-phone",
    data: {
      phone: data.phone,
      code: data.code,
      iaccept: data.iaccept,
    },
  });
  return res.data;
};

// 获取用户信息
export const getUserProfile = async () => {
  const res = await reapi({
    method: "GET",
    url: "/user/profile",
  });
  //console.log(res.data)
  return res.data;
};

export const loginbyAccount = async (data:AccountData) => {
  const res = await reapi({
    method: "POST",
    // url: "/auth/login-by-account",
    url: "/auth/login-by-account",
    data: {
      account: data.account,
      password: data.password,
    },
  });
  return res.data;
};

export const loginOut = async() => {
  const res = await reapi({
    method:'GET',
    url:"/auth/logout"
  })
  return res
}

export const checkSafe = async() => {
  const res = await reapi({
    method:'GET',
    url:"/user/safety-level"
  })
  return res.data?.level
}

export const changePhone = async() => {
  const res = await reapi({
    method:'POST',
    url:"/auth/change-phone-safety"
  })
  return res.data
}