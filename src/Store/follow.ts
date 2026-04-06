import { ref } from "vue";
import { defineStore } from "pinia";
import {
  handleFollow,
  handleUnFollow,
  queryFollowingList,
  queryFollowStatsByRid,
} from "../Hooks/SubScribe";
import { createToast } from "../Utils/reks-toast";

interface ToggleFollowOptions {
  rid: number;
  toast: Parameters<typeof createToast>[0];
  canFollow?: boolean;
}

const unique = (list: number[]) => [...new Set(list)];

export const followStore = defineStore("follow", () => {
  const followingRidList = ref<number[]>([]);
  const followingLoaded = ref(false);
  const followingLoading = ref(false);
  const pendingRidList = ref<number[]>([]);
  const followStatsByRid = ref<Record<number, { followingCount: number; followerCount: number }>>({});

  const isValidRid = (rid: number) => Number.isInteger(rid) && rid > 0;

  const isSubscribed = (rid: number) => {
    if (!isValidRid(rid)) return false;
    return followingRidList.value.includes(rid);
  };

  const isFollowPending = (rid: number) => {
    if (!isValidRid(rid)) return false;
    return pendingRidList.value.includes(rid);
  };

  const setPending = (rid: number, pending: boolean) => {
    if (!isValidRid(rid)) return;
    if (pending) {
      pendingRidList.value = unique([...pendingRidList.value, rid]);
      return;
    }
    pendingRidList.value = pendingRidList.value.filter((item) => item !== rid);
  };

  const setSubscribed = (rid: number, next: boolean) => {
    if (!isValidRid(rid)) return;
    if (next) {
      followingRidList.value = unique([...followingRidList.value, rid]);
      return;
    }
    followingRidList.value = followingRidList.value.filter((item) => item !== rid);
  };

  const syncFollowingList = async (force = false) => {
    if (followingLoading.value) return;
    if (followingLoaded.value && !force) return;

    followingLoading.value = true;
    try {
      const list = await queryFollowingList();
      followingRidList.value = unique(list.map((item) => item.rid).filter((rid) => isValidRid(rid)));
      followingLoaded.value = true;
    } catch {
      followingRidList.value = [];
      followingLoaded.value = false;
    } finally {
      followingLoading.value = false;
    }
  };

  const syncSubscribeStateByRid = async (rid: number, canFollow = true) => {
    if (!isValidRid(rid) || !canFollow) return false;
    await syncFollowingList();
    return isSubscribed(rid);
  };

  const toggleSubscribeByRid = async ({ rid, toast, canFollow = true }: ToggleFollowOptions) => {
    if (!isValidRid(rid)) {
      createToast(toast, "关注失败", "无效的用户 ID", "danger");
      return;
    }
    if (!canFollow || isFollowPending(rid)) return;

    await syncFollowingList();

    setPending(rid, true);
    try {
      const actionRes = isSubscribed(rid)
        ? await handleUnFollow(rid)
        : await handleFollow(rid);

      if (actionRes.status === 200) {
        setSubscribed(rid, !isSubscribed(rid));
        createToast(toast, "操作成功", actionRes.msg, "success");
        return;
      }

      createToast(toast, "操作失败", actionRes.msg || "请稍后重试", "danger");
      await syncFollowingList(true);
    } catch {
      createToast(toast, "操作失败", "网络错误，请稍后重试", "danger");
    } finally {
      setPending(rid, false);
    }
  };

  const fetchFollowStatsByRid = async (rid: number, force = false) => {
    if (!isValidRid(rid)) return null;
    if (!force && followStatsByRid.value[rid]) return followStatsByRid.value[rid];

    try {
      const res = await queryFollowStatsByRid(rid);
      followStatsByRid.value = {
        ...followStatsByRid.value,
        [rid]: {
          followingCount: Number(res?.followingCount ?? 0),
          followerCount: Number(res?.followerCount ?? 0),
        },
      };
      return followStatsByRid.value[rid];
    } catch {
      return null;
    }
  };

  return {
    followingRidList,
    followingLoaded,
    followingLoading,
    pendingRidList,
    followStatsByRid,
    isSubscribed,
    isFollowPending,
    syncFollowingList,
    syncSubscribeStateByRid,
    toggleSubscribeByRid,
    fetchFollowStatsByRid,
  };
});