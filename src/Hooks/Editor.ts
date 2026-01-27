import reapi from "../Requests/reapi";

export const upload_img = async(form:FormData) => {
  const { data: res } = await reapi({
    url: "/blog/upload/img",
    method: "POST",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res
};
