<script setup lang="ts">
import { onUnmounted,onMounted } from "vue";
import { wsClient } from "../Requests/ws-regql";
import { useToast } from "bootstrap-vue-next";
import { createToast } from "../Utils/reks-toast";
import type { EventSnapshot } from "../Utils/reks-interface";
import { noticeStore } from "../Store/notice";
import { storeToRefs } from "pinia";
import { userStore } from "../Store/user";

const toast = useToast();
const notice = noticeStore();

function useEventSubscription() {
  // 开始订阅，拿到“关闭函数”
  const unsubscribe = wsClient.subscribe<{ pushEvent: EventSnapshot }>(
    {
      query: `subscription { pushEvent { eventType payload } }`,
    },
    {
      next: ({ data }) => {
        const res = data?.pushEvent ?? null;
        notice.setLatest(res);
        if (res) {
          createToast(toast, `${res.eventType}消息`, res.payload, "primary");
        }
      },
      error: console.error,
      complete: () => {},
    },
  );

  // 组件销毁时停止监听
  onUnmounted(() => unsubscribe());
}

useEventSubscription();

onMounted(() => {
  const { safeLevel } = storeToRefs(userStore());
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
</script>

<template>
  <BContainer class="main-layout mb-5">
    <router-view />
  </BContainer>
</template>

<style scoped></style>
