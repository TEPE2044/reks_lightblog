<script lang="ts" setup>
import { set} from "@vueuse/core";
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";
import { createToast } from "../Utils/reks-toast";
import { useToast } from "bootstrap-vue-next";
const { isOriginal,trackTitle, trackDesc, audioFile, coverFile } =
storeToRefs(musicStore());

const toast = useToast();
// 封面上传
const handleCoverUpload = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let temp = (e.target as HTMLInputElement).files?.[0];
  if (!temp) {
    return;
  }
  if (!temp?.type.startsWith("image/")) {
    createToast(toast, "类型错误", "请上传图片类型文件", "warning");
    input.value = "";
    set(coverFile, null);
    return;
  } else {
    set(coverFile, temp);
  }
};

// 音频上传
const handleAudioUpload = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let temp = (e.target as HTMLInputElement).files?.[0];
  if (!temp) {
    return;
  }
  if (!temp?.type.startsWith("audio/")) {
    createToast(toast, "类型错误", "请上传音频类型文件", "warning");
    input.value = "";
    set(audioFile, null);
    return;
  } else {
    set(audioFile, temp);
    set(trackTitle, temp?.name);
  }
};
  // TODO:新建合辑、新建音频
  
</script>
<template>
    <div class="music-form">
        <!-- 原创/转载选择 -->
        <div class="btn-group mt-3 mb-2" id="isor" role="group">
          <input
            type="radio"
            class="btn-check"
            id="original"
            v-model="isOriginal"
            value="true"
          />
          <label class="btn btn-outline-primary" for="original">原创</label>

          <input
            type="radio"
            class="btn-check"
            id="repost"
            v-model="isOriginal"
            value="false"
          />
          <label class="btn btn-outline-primary" for="repost">转载</label>
        </div>

        <!-- 标题 -->
        <div class="form-floating mt-3 mb-3">
          <input
            v-model="trackTitle"
            type="text"
            class="form-control"
            id="uploadTitle"
            minlength="1"
            required
          />
          <label for="uploadTitle">歌曲名称</label>
        </div>

        <!-- 描述 -->
        <div class="form-floating mb-3">
          <textarea
            v-model="trackDesc"
            class="form-control"
            id="uploadContent"
            style="height: 8rem; resize: none"
            required
          ></textarea>
          <label for="uploadContent">简介</label>
        </div>
      </div>
      <!--文件上传-->
      <p>添加歌曲封面</p>
      <div class="input-group mb-3">
        <input
          type="file"
          id="uploadIcon"
          class="form-control"
          @change="handleCoverUpload"
          accept="image/*"
          required
        />
      </div>

      <p>上传音频文件</p>
      <div class="input-group mb-3">
        <input
          type="file"
          id="uploadAudio"
          class="form-control"
          :multiple="true"
          @change="handleAudioUpload"
          accept="audio/mp3,audio/wav"
          required
        />
      </div>
      <div class="file-box">
        {{ audioFile?.name }}
      </div>
</template>

<style lang="scss" scoped></style>
