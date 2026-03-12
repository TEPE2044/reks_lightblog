import reapi from "../Requests/reapi";

export type FavoriteTargetType = "blog" | "music";

export interface FavoriteStatusResponse {
  msg: string;
  is_favorited: boolean;
}

export interface FavoriteBatchStatusResponse {
  msg: string;
  items: Record<number, boolean>;
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
