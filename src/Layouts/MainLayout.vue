<script setup lang="ts">
import { onUnmounted, onMounted, watch } from "vue";
import { wsClient } from "../Requests/ws-regql";
import { useToast } from "bootstrap-vue-next";
import { createToast } from "../Utils/reks-toast";
import type { EventSnapshot } from "../Utils/reks-interface";
// import { noticeStore } from "../Store/notice";
import { storeToRefs } from "pinia";
import { userStore } from "../Store/user";
import { substore } from "../Store/subscribe";
import {
  formatEventDetails,
  makeSubscribeMessage,
  resolveEventTitle,
} from "../Utils/subscribe-log";

const toast = useToast();
const user = userStore();
const { userInfo, rcode, payload } = storeToRefs(user);
const { initSubscribeList, addSubscribeMessage } = substore();
// const notice = noticeStore();

const resolveCurrentRid = () => {
  if (userInfo.value?.reks_id) {
    return userInfo.value.reks_id;
  }
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return "guest";
    const localUser = JSON.parse(raw) as { reks_id?: number | string };
    return localUser?.reks_id ?? "guest";
  } catch {
    return "guest";
  }
};

let unsubscribeFn: (() => void) | null = null;

function useEventSubscription() {
  if (unsubscribeFn) {
    unsubscribeFn();
    unsubscribeFn = null;
  }

  // 开始订阅，拿到“关闭函数”
  const unsubscribe = wsClient.subscribe<{ pushEvent: EventSnapshot }>(
    {
      query: `subscription { pushEvent { eventType payload } }`,
    },
    {
      next: ({ data }) => {
        const res = data?.pushEvent ?? null;
        // notice.setLatest(res);
        if (res) {
          const detail = formatEventDetails(res.eventType, res.payload);
          createToast(toast, resolveEventTitle(res.eventType), detail, "primary");
          addSubscribeMessage(
            makeSubscribeMessage(res.eventType, detail),
            resolveCurrentRid(),
          );
        }
      },
      error: console.error,
      complete: () => {},
    },
  );
  unsubscribeFn = unsubscribe;
}

onMounted(() => {
  const { safeLevel } = storeToRefs(user);
  initSubscribeList(resolveCurrentRid());
  useEventSubscription();
  try {
    if (safeLevel.value === "weak") {
      console.log(safeLevel.value);
      createToast(
        toast,
        "账号安全",
        "当前账号风险较高，请设置密码和邮箱",
        "danger",
      );
    }
  } catch (e) {
    console.error(e);
  }
});

onUnmounted(() => {
  if (unsubscribeFn) {
    unsubscribeFn();
    unsubscribeFn = null;
  }
});

watch(
  () => userInfo.value?.reks_id,
  (rid) => {
    initSubscribeList(rid ?? "guest");
  },
);

watch([rcode, payload], () => {
  useEventSubscription();
});
</script>

<template>
  <BContainer class="main-layout mb-5">
    <router-view />
  </BContainer>
</template>

<style scoped></style>
