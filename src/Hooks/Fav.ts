import reapi from "../Requests/reapi";
import type {
  FavoriteBlogItem,
  FavoriteListResponse,
  FavoriteMusicItem,
} from "../Utils/reks-interface";

export type FavoriteTargetType = "blog" | "music";

export interface FavoriteStatusResponse {
  msg: string;
  is_favorited: boolean;
}

export interface FavoriteBatchStatusResponse {
  msg: string;
  items: Record<number, boolean>;
}

export interface LikeStatusResponse {
  msg: string;
  is_liked: boolean;
  like_count?: number;
}

export interface LikeBatchStatusResponse {
  msg: string;
  items: Record<number, boolean>;
}

export interface LikeCountResponse {
  msg: string;
  like_count: number;
}

export const hasFavoriteAuthSession = () => {
  const rcode = localStorage.getItem("rcode");
  const payload = localStorage.getItem("payload");
  return Boolean(rcode && payload);
};

export const queryFavoriteStatus = async (
  id: number,
  targetType: FavoriteTargetType,
) => {
  const { data } = await reapi({
    url: `/fav/status/${id}`,
    method: "GET",
    params: {
      target_type: targetType,
    },
  });
  return data as FavoriteStatusResponse;
};

export const queryFavoriteStatusBatch = async (
  ids: number[],
  targetType: FavoriteTargetType,
) => {
  const { data } = await reapi({
    url: "/fav/status/batch",
    method: "POST",
    data: {
      target_type: targetType,
      ids,
    },
  });
  return data as FavoriteBatchStatusResponse;
};

export const queryLikeStatus = async (id: number) => {
  const { data } = await reapi({
    url: `/fav/like/status/${id}`,
    method: "GET",
  });
  return data as LikeStatusResponse;
};

export const queryLikeStatusBatch = async (ids: number[]) => {
  const { data } = await reapi({
    url: "/fav/like/status/batch",
    method: "POST",
    data: {
      ids,
    },
  });
  return data as LikeBatchStatusResponse;
};

export const queryLikeCount = async (id: number) => {
  const { data } = await reapi({
    url: `/fav/like/count/${id}`,
    method: "GET",
  });
  return data as LikeCountResponse;
};

export const setFavoriteState = async (
  id: number,
  targetType: FavoriteTargetType,
  favorited: boolean,
) => {
  const { data } = await reapi({
    url: `/fav/${id}`,
    method: "POST",
    data: {
      target_type: targetType,
      favorited,
    },
  });
  return data as FavoriteStatusResponse;
};

export const setLikeState = async (id: number, liked: boolean) => {
  const { data } = await reapi({
    url: `/fav/like/${id}`,
    method: "POST",
    data: {
      liked,
    },
  });
  return data as LikeStatusResponse;
};

export const queryMyFavorites = async <T extends FavoriteBlogItem | FavoriteMusicItem>(
  targetType: FavoriteTargetType,
) => {
  const { data } = await reapi({
    url: "/fav/my-fav",
    method: "GET",
    params: {
      target_type: targetType,
    },
  });
  return data as FavoriteListResponse<T>;
};

export const queryUserFavorites = async <T extends FavoriteBlogItem | FavoriteMusicItem>(
  rid: number,
  targetType: FavoriteTargetType,
) => {
  const { data } = await reapi({
    url: `/fav/user/${rid}`,
    method: "GET",
    params: {
      target_type: targetType,
    },
  });
  return data as FavoriteListResponse<T>;
};
