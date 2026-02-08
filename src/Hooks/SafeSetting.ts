import reapi from "../Requests/reapi";

export const setPasswordSafety = async (psw: string) => {
  const res = await reapi({
    url: "/auth/set-password-safety",
    method: "POST",
    data: {
      psw:psw
    }
  });
  console.log(res)
  return res.data;
};

export const setEmailSafety = async(email:string) => {
  const res = await reapi({
    url:"/auth/set-email-safety",
    method:'POST',
    data:{
      email:email
    }
  })
  console.log(res)
  return res.data
}
