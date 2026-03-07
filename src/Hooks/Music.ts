import reapi from "../Requests/reapi";
import type { MusicData } from "../Utils/reks-interface";

export const query_my_music = async () => {
  const { data: res } = await reapi({
    url: "/music/my-music",
    method: "GET",
  });
  // console.warn(res)
  return res;
};

export const query_music_by_user_id = async (rid: number) => {
  const { data: res } = await reapi({
    url: `/music/user/${rid}`,
    method: "GET",
  });
  return res;
};

export const upload_music = async (form: FormData) => {
  const { data: res } = await reapi({
    url: "/music/upload/audio",
    method: "POST",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const upload_music_form = async (data: MusicData) => {
  const { data: res } = await reapi({
    url: "/music/my-music/new",
    method: "POST",
    data: data,
  });
  return res.data;
};
