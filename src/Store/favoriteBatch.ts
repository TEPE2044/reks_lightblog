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
//返回类型
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
  // statusMap: 当前是否已点赞/已收藏，是最终要展示的结果本身
  // readyMap: 这一项的初始状态是否已经从后端同步回来
  // pendingMap: 这一项是否正在提交切换请求，用来防止重复点击
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
  
  //reset用于重置状态
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
  
  // 通用方法 根据id批量获取状态
  const syncTargetStatusByIds = async (
    rawIds: number[],
    targetType: FavoriteTargetType,
    statusMap: Ref<Record<number, boolean>>,
    readyMap: Ref<Record<number, boolean>>,
    batchFailed: Ref<boolean>,
  ): Promise<SyncStatus> => {
    // 去重后再批量请求，避免同一个 id 在同一轮里重复查询
    // .filter过滤掉null undefined，.filter后面的条件是保存 
    // Set去重之后，重新恢复为数组
    const ids = [...new Set(rawIds.filter((id) => Number.isInteger(id)))];
    // as const 的作用是告诉 TypeScript：这里返回的不是普通字符串 string，而是字面量类型 "ok"。 
    // "ok"：值是 ok  /"ok" as const：值是 ok，而且类型也锁定为 "ok"
    if (ids.length === 0) return "ok" as const;

    ids.forEach((id) => {
      // 开始同步前先标记为“未就绪”，这样 UI 可以决定先禁用按钮或显示占位态
      readyMap.value[id] = false;
    });

    if (!hasFavoriteAuthSession()) {
      ids.forEach((id) => {
        // 游客没有登录态时，默认按 false 处理，但也要标记 ready，避免界面一直等待
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
  // Record<number,boolean> 纯对象
  const handleTargetFavoriteToggle = async (
    payload: FavoriteTogglePayload,
    targetType: FavoriteTargetType,
    statusMap: Ref<Record<number, boolean>>,
    pendingMap: Ref<Record<number, boolean>>,
  ): Promise<ToggleResult> => {
    const id = payload.id;
    if (pendingMap.value[id]) {
      // 同一项上一次请求还没结束时，直接忽略这次点击，避免连点造成状态乱跳
      return { status: "ignored" as const };
    }

    if (!hasFavoriteAuthSession()) {
      return { status: "not_logged_in" as const };
    }

    const previous = Boolean(statusMap.value[id]);
  // 请求发出前先锁住按钮，并做一次乐观更新，让界面立即响应用户点击
    pendingMap.value[id] = true;
    statusMap.value[id] = payload.next;

    try {
      const res = await setFavoriteState(id, targetType, payload.next);
      statusMap.value[id] = res.is_favorited;
      return { status: "ok" as const, isFavorited: res.is_favorited, msg: res.msg };
    } catch (e) {
      console.error(e);
      // 如果接口失败，就把界面状态回滚到点击前
      statusMap.value[id] = previous;
      return { status: "failed" as const };
    } finally {
      // 无论成功还是失败，最后都要解锁按钮
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
      // 点赞也走同样的“请求中锁定”策略，避免短时间重复提交
      return { status: "ignored" as const };
    }

    if (!hasFavoriteAuthSession()) {
      return { status: "not_logged_in" as const };
    }

    const previous = Boolean(likeStatusMap.value[id]);
  // 先更新本地状态，等接口返回后再用服务端真值纠正
    likePendingMap.value[id] = true;
    likeStatusMap.value[id] = payload.next;

    try {
      const res = await setLikeState(id, payload.next);
      likeStatusMap.value[id] = res.is_liked;
      return { status: "ok" as const, isLiked: res.is_liked, msg: res.msg };
    } catch (e) {
      console.error(e);
      // 点赞失败时回滚，保证页面和数据库最终一致
      likeStatusMap.value[id] = previous;
      return { status: "failed" as const };
    } finally {
      // 请求结束后释放锁，按钮才允许再次点击
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
