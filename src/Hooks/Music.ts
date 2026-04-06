import reapi from "../Requests/reapi";
import type { MusicData } from "../Utils/reks-interface";
import type { MusicResponse } from "../Utils/reks-interface";

export interface MusicCursorResponse {
  items: MusicResponse[];
  next_cursor: number | null;
  has_more: boolean;
}

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

export const query_music_by_user_id_cursor = async (
  rid: number,
  cursor: number | null,
  limit = 9,
) => {
  const { data: res } = await reapi({
    url: `/music/user/${rid}/cursor`,
    method: "POST",
    data: {
      cursor,
      limit,
    },
  });
  return res as MusicCursorResponse;
};

export const query_my_music_cursor = async (
  cursor: number | null,
  limit = 9,
) => {
  const { data: res } = await reapi({
    url: "/music/my-music/cursor",
    method: "POST",
    data: {
      cursor,
      limit,
    },
  });
  return res as MusicCursorResponse;
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

export const delete_music = async (music_id: Number) => {
  const res = await reapi({
    url: `/music/delete`,
    method:'DELETE',
    params:{
      music_id
    }
  })
  return res
}

export const get_hot_music = async () => {
  const res = await reapi({
    url:`/music/hot`,
    method:'GET'
  })
  return res.data
}