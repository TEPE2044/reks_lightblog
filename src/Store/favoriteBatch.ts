import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import {
  hasFavoriteAuthSession,
  queryLikeStatusBatch,
  queryFavoriteStatusBatch,
  setLikeState,
  setFavoriteState,
} from "../Hooks/Fav";
import type { FavoriteTargetType } from "../Hooks/Fav";

export interface FavoriteTogglePayload {
  id: number;
  next: boolean;
}

export interface FavoriteItemLike {
  id: number;
}

type SyncStatus = "ok" | "guest" | "degraded" | "degraded-first";

type ToggleResult =
  | { status: "ignored" }
  | { status: "not_logged_in" }
  | { status: "failed" }
  | { status: "ok"; isFavorited: boolean; msg: string };

type LikeToggleResult =
  | { status: "ignored" }
  | { status: "not_logged_in" }
  | { status: "failed" }
  | { status: "ok"; isLiked: boolean; msg: string };

export const favoriteBatchStore = defineStore("favoriteBatch", () => {
  const favoriteStatusMap = ref<Record<number, boolean>>({});
  const favoriteReadyMap = ref<Record<number, boolean>>({});
  const favoritePendingMap = ref<Record<number, boolean>>({});
  const favoriteBatchFailed = ref(false);

  const musicFavoriteStatusMap = ref<Record<number, boolean>>({});
  const musicFavoriteReadyMap = ref<Record<number, boolean>>({});
  const musicFavoritePendingMap = ref<Record<number, boolean>>({});
  const musicFavoriteBatchFailed = ref(false);

  const likeStatusMap = ref<Record<number, boolean>>({});
  const likeReadyMap = ref<Record<number, boolean>>({});
  const likePendingMap = ref<Record<number, boolean>>({});
  const likeBatchFailed = ref(false);

  const resetBlogFavoriteState = () => {
    favoriteStatusMap.value = {};
    favoriteReadyMap.value = {};
    favoritePendingMap.value = {};
    favoriteBatchFailed.value = false;
  };

  const resetMusicFavoriteState = () => {
    musicFavoriteStatusMap.value = {};
    musicFavoriteReadyMap.value = {};
    musicFavoritePendingMap.value = {};
    musicFavoriteBatchFailed.value = false;
  };

  const resetFavoriteState = () => {
    resetBlogFavoriteState();
    resetMusicFavoriteState();
  };

  const resetLikeState = () => {
    likeStatusMap.value = {};
    likeReadyMap.value = {};
    likePendingMap.value = {};
    likeBatchFailed.value = false;
  };

  const syncTargetStatusByIds = async (
    rawIds: number[],
    targetType: FavoriteTargetType,
    statusMap: Ref<Record<number, boolean>>,
    readyMap: Ref<Record<number, boolean>>,
    batchFailed: Ref<boolean>,
  ): Promise<SyncStatus> => {
    const ids = [...new Set(rawIds.filter((id) => Number.isInteger(id)))];
    if (ids.length === 0) return "ok" as const;

    ids.forEach((id) => {
      readyMap.value[id] = false;
    });

    if (!hasFavoriteAuthSession()) {
      ids.forEach((id) => {
        statusMap.value[id] = false;
        readyMap.value[id] = true;
      });
      return "guest" as const;
    }

    try {
      const res = await queryFavoriteStatusBatch(ids, targetType);
      const map = (res.items || {}) as Record<string, boolean>;
      ids.forEach((id) => {
        statusMap.value[id] = Boolean(map[String(id)]);
        readyMap.value[id] = true;
      });
      batchFailed.value = false;
      return "ok" as const;
    } catch (e) {
      console.error(e);
      ids.forEach((id) => {
        if (statusMap.value[id] === undefined) {
          statusMap.value[id] = false;
        }
        readyMap.value[id] = true;
      });
      const isFirst = !batchFailed.value;
      batchFailed.value = true;
      return isFirst ? ("degraded-first" as const) : ("degraded" as const);
    }
  };

  const syncFavoriteStatusByIds = async (rawIds: number[]) => {
    return syncTargetStatusByIds(
      rawIds,
      "blog",
      favoriteStatusMap,
      favoriteReadyMap,
      favoriteBatchFailed,
    );
  };

  const syncFavoriteStatusForBlogs = async (items: FavoriteItemLike[]) => {
    return syncFavoriteStatusByIds(items.map((item) => item.id));
  };

  const syncMusicFavoriteStatusByIds = async (rawIds: number[]) => {
    return syncTargetStatusByIds(
      rawIds,
      "music",
      musicFavoriteStatusMap,
      musicFavoriteReadyMap,
      musicFavoriteBatchFailed,
    );
  };

  const syncFavoriteStatusForMusic = async (items: FavoriteItemLike[]) => {
    return syncMusicFavoriteStatusByIds(items.map((item) => item.id));
  };

  const syncLikeStatusByIds = async (rawIds: number[]): Promise<SyncStatus> => {
    const ids = [...new Set(rawIds.filter((id) => Number.isInteger(id)))];
    if (ids.length === 0) return "ok" as const;

    ids.forEach((id) => {
      likeReadyMap.value[id] = false;
    });

    if (!hasFavoriteAuthSession()) {
      ids.forEach((id) => {
        likeStatusMap.value[id] = false;
        likeReadyMap.value[id] = true;
      });
      return "guest" as const;
    }

    try {
      const res = await queryLikeStatusBatch(ids);
      const map = (res.items || {}) as Record<string, boolean>;
      ids.forEach((id) => {
        likeStatusMap.value[id] = Boolean(map[String(id)]);
        likeReadyMap.value[id] = true;
      });
      likeBatchFailed.value = false;
      return "ok" as const;
    } catch (e) {
      console.error(e);
      ids.forEach((id) => {
        if (likeStatusMap.value[id] === undefined) {
          likeStatusMap.value[id] = false;
        }
        likeReadyMap.value[id] = true;
      });
      const isFirst = !likeBatchFailed.value;
      likeBatchFailed.value = true;
      return isFirst ? ("degraded-first" as const) : ("degraded" as const);
    }
  };

  const syncLikeStatusForBlogs = async (items: FavoriteItemLike[]) => {
    return syncLikeStatusByIds(items.map((item) => item.id));
  };

  const handleTargetFavoriteToggle = async (
    payload: FavoriteTogglePayload,
    targetType: FavoriteTargetType,
    statusMap: Ref<Record<number, boolean>>,
    pendingMap: Ref<Record<number, boolean>>,
  ): Promise<ToggleResult> => {
    const id = payload.id;
    if (pendingMap.value[id]) {
      return { status: "ignored" as const };
    }

    if (!hasFavoriteAuthSession()) {
      return { status: "not_logged_in" as const };
    }

    const previous = Boolean(statusMap.value[id]);
    pendingMap.value[id] = true;
    statusMap.value[id] = payload.next;

    try {
      const res = await setFavoriteState(id, targetType, payload.next);
      statusMap.value[id] = res.is_favorited;
      return { status: "ok" as const, isFavorited: res.is_favorited, msg: res.msg };
    } catch (e) {
      console.error(e);
      statusMap.value[id] = previous;
      return { status: "failed" as const };
    } finally {
      pendingMap.value[id] = false;
    }
  };

  const handleFavoriteToggle = async (payload: FavoriteTogglePayload) => {
    return handleTargetFavoriteToggle(payload, "blog", favoriteStatusMap, favoritePendingMap);
  };

  const handleMusicFavoriteToggle = async (payload: FavoriteTogglePayload) => {
    return handleTargetFavoriteToggle(payload, "music", musicFavoriteStatusMap, musicFavoritePendingMap);
  };

  const handleLikeToggle = async (payload: FavoriteTogglePayload): Promise<LikeToggleResult> => {
    const id = payload.id;
    if (likePendingMap.value[id]) {
      return { status: "ignored" as const };
    }

    if (!hasFavoriteAuthSession()) {
      return { status: "not_logged_in" as const };
    }

    const previous = Boolean(likeStatusMap.value[id]);
    likePendingMap.value[id] = true;
    likeStatusMap.value[id] = payload.next;

    try {
      const res = await setLikeState(id, payload.next);
      likeStatusMap.value[id] = res.is_liked;
      return { status: "ok" as const, isLiked: res.is_liked, msg: res.msg };
    } catch (e) {
      console.error(e);
      likeStatusMap.value[id] = previous;
      return { status: "failed" as const };
    } finally {
      likePendingMap.value[id] = false;
    }
  };

  return {
    favoriteStatusMap,
    favoriteReadyMap,
    favoritePendingMap,
    musicFavoriteStatusMap,
    musicFavoriteReadyMap,
    musicFavoritePendingMap,
    likeStatusMap,
    likeReadyMap,
    likePendingMap,
    resetBlogFavoriteState,
    resetMusicFavoriteState,
    resetFavoriteState,
    resetLikeState,
    syncFavoriteStatusByIds,
    syncFavoriteStatusForBlogs,
    syncMusicFavoriteStatusByIds,
    syncFavoriteStatusForMusic,
    syncLikeStatusByIds,
    syncLikeStatusForBlogs,
    handleFavoriteToggle,
    handleMusicFavoriteToggle,
    handleLikeToggle,
  };
});
