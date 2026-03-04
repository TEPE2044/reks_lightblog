<script setup lang="ts">
// TODO:处理错误
import "vue-select-avatar/style.css";
import {
  Viewport,
  Preview,
  isCancelError,
  getErrorMessage,
} from "vue-select-avatar";

import { ref } from "vue";
import { useToast, useToggle } from "bootstrap-vue-next";
import { userStore } from "../Store/user";
import { createToast } from "../Utils/reks-toast";
const esa = useToggle("avatar-me");
const selectAvatar = () => {
  esa.show();
};

const user = userStore();
const toast = useToast();
const viewportRef = ref<InstanceType<typeof Viewport>>();



const src = ref("");
const fileSize = ref(0);
const size = ref(0);

const handleSelect = () => {
  viewportRef.value?.select({ maxFileSize: 20 * 1024 * 1024 }).catch((err) => {
    if (isCancelError(err)) return;

    if (getErrorMessage(err)) {
      createToast(toast, "错误文件", "文件过大或者 你确定这是图片？", "danger");
      console.error(err);
      return;
    }
  });
};

const handleCropper = async () => {
  try {
    const file = await viewportRef.value?.cropper<File>();
    if (file) {
      if (src.value) {
        URL.revokeObjectURL(src.value);
      }
      src.value = URL.createObjectURL(file);
      fileSize.value = file.size;
      user.tempAvatar = file;
    }
  } catch (error) {
    // 错误处理
    console.error(error);
  }
};

const handleClear = () => {
  src.value = "";
};

const handleLoad = (e: Event) => {
  size.value = (e.target as HTMLImageElement).naturalWidth;
};

// 辅助函数
// const formatBytes = (bytes: number, decimals = 2) => {
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const units:string | any = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + units[i] + "B";
// };
</script>

<template>
  <div class="avatar d-flex align-items-center gap-2">
    <div class="avatar-click" @click="selectAvatar" v-if="!src">
      <BAvatar size="100px" :src="user.userInfo.avatar || ''" />
    </div>

    <BAvatar v-else :src="src" size="100px" @load="handleLoad" />
    <BButton class="ms-4" @click="handleClear" :disabled="!src">清除</BButton>
    <BModal
      id="avatar-me"
      @ok="handleCropper"
      title="选择头像"
      ok-title="截取"
      cancel-title="取消"
    >
      <BButton class="mb-3" @click="handleSelect">选择图片</BButton>

      <div
        class="view-box d-flex gap-5 align-items-center justify-content-center"
      >
        <Viewport
          class="viewport"
          :width="180"
          :height="180"
          ref="viewportRef"
          grid
          fixed-image
        />
        <Preview :round="true" :viewport-ref="viewportRef" bg="#252526" />
      </div>
    </BModal>
  </div>
  <!-- <div style="font-size: 13px">
      {{ `${size}x${size} ${formatBytes(fileSize)}` }}
    </div> -->
</template>

<style lang="scss" scoped>
:deep(.b-avatar-img img) {
  image-rendering: -webkit-optimize-quality;
  image-rendering: crisp-edges;
  filter: blur(0.5px) !important;
  transform: scale(1.005) !important;
}
</style>
