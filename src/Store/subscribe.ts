import { defineStore } from "pinia";
import { ref } from "vue";

export interface SubscribeMessage {
  id: string;
  title: string;
  details: string;
  eventType: string;
  createdAt: string;
}

const storageKeyByRid = (rid: string | number) => `subscribeList:${rid}`;
const unreadStorageKeyByRid = (rid: string | number) => `subscribeUnreadFollowing:${rid}`;

const resolveRid = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return "guest";
    const user = JSON.parse(raw) as { reks_id?: number | string };
    return user?.reks_id ?? "guest";
  } catch {
    return "guest";
  }
};

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const normalizeMessage = (item: Partial<SubscribeMessage>): SubscribeMessage => ({
  id: item.id || makeId(),
  title: item.title || "系统消息",
  details: item.details || "",
  eventType: item.eventType || "system.notice",
  createdAt: item.createdAt || new Date().toISOString(),
});

// 订阅消息的 store，本地存储订阅消息列表，提供添加和清空功能
export const substore = defineStore("subscribe", () => {
  const subscribeList = ref<SubscribeMessage[]>([]);
  const activeRid = ref<string | number>("guest");
  const unreadFollowingRidList = ref<number[]>([]);

  const initSubscribeList = (rid?: string | number) => {
    activeRid.value = rid ?? resolveRid();

    const raw = localStorage.getItem(storageKeyByRid(activeRid.value));
    if (!raw) {
      subscribeList.value = [];
    } else {
      try {
        const parsed = JSON.parse(raw) as Array<Partial<SubscribeMessage>>;
        subscribeList.value = Array.isArray(parsed)
          ? parsed.map((item) => normalizeMessage(item))
          : [];
      } catch (e) {
        console.error("订阅日志解析失败:", e);
        subscribeList.value = [];
      }
    }

    const unreadRaw = localStorage.getItem(unreadStorageKeyByRid(activeRid.value));
    try {
      const parsedUnread = unreadRaw ? (JSON.parse(unreadRaw) as number[]) : [];
      unreadFollowingRidList.value = Array.isArray(parsedUnread)
        ? parsedUnread.filter((item) => Number.isFinite(Number(item))).map((item) => Number(item))
        : [];
    } catch (e) {
      console.error("订阅未读状态解析失败:", e);
      unreadFollowingRidList.value = [];
    }
  };

  const persist = () => {
    localStorage.setItem(
      storageKeyByRid(activeRid.value),
      JSON.stringify(subscribeList.value),
    );
  };

  const persistUnread = () => {
    localStorage.setItem(
      unreadStorageKeyByRid(activeRid.value),
      JSON.stringify(unreadFollowingRidList.value),
    );
  };

  const addSubscribeMessage = (
    message: Partial<SubscribeMessage>,
    rid?: string | number,
  ) => {
    if (rid !== undefined && rid !== activeRid.value) {
      initSubscribeList(rid);
    }
    subscribeList.value.unshift(normalizeMessage(message));
    persist();
  };

  const removeallMessage = (rid?: string | number) => {
    if (rid !== undefined && rid !== activeRid.value) {
      initSubscribeList(rid);
    }
    subscribeList.value = [];
    unreadFollowingRidList.value = [];
    localStorage.removeItem(storageKeyByRid(activeRid.value));
    localStorage.removeItem(unreadStorageKeyByRid(activeRid.value));
  };

  const hasUnreadFollowing = () => unreadFollowingRidList.value.length > 0;

  const isFollowingRidUnread = (rid: number) =>
    unreadFollowingRidList.value.includes(Number(rid));

  const markFollowingUpdated = (rid: number) => {
    const before = hasUnreadFollowing();
    const targetRid = Number(rid);
    if (!Number.isFinite(targetRid)) {
      return false;
    }
    if (!unreadFollowingRidList.value.includes(targetRid)) {
      unreadFollowingRidList.value.unshift(targetRid);
      persistUnread();
    }
    return !before && hasUnreadFollowing();
  };

  const markFollowingRead = (rid: number) => {
    const targetRid = Number(rid);
    unreadFollowingRidList.value = unreadFollowingRidList.value.filter(
      (item) => item !== targetRid,
    );
    persistUnread();
  };

  // const outputSubscribeMessage = (item:HTMLElement) => {
  //   print()
  // }


  return {
    subscribeList,
    activeRid,
    unreadFollowingRidList,
    initSubscribeList,
    addSubscribeMessage,
    removeallMessage,
    hasUnreadFollowing,
    isFollowingRidUnread,
    markFollowingUpdated,
    markFollowingRead,
    // outputSubscribeMessage
  };
});
