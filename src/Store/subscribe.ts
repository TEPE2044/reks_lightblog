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

  const initSubscribeList = (rid?: string | number) => {
    activeRid.value = rid ?? resolveRid();
    const raw = localStorage.getItem(storageKeyByRid(activeRid.value));
    if (!raw) {
      subscribeList.value = [];
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Array<Partial<SubscribeMessage>>;
      subscribeList.value = Array.isArray(parsed)
        ? parsed.map((item) => normalizeMessage(item))
        : [];
    } catch (e) {
      console.error("订阅日志解析失败:", e);
      subscribeList.value = [];
    }
  };

  const persist = () => {
    localStorage.setItem(
      storageKeyByRid(activeRid.value),
      JSON.stringify(subscribeList.value),
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
    localStorage.removeItem(storageKeyByRid(activeRid.value));
  };

  // const outputSubscribeMessage = (item:HTMLElement) => {
  //   print()
  // }


  return {
    subscribeList,
    activeRid,
    initSubscribeList,
    addSubscribeMessage,
    removeallMessage,
    // outputSubscribeMessage
  };
});
