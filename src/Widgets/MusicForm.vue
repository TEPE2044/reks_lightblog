<script lang="ts" setup>
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";
import type { MusicData } from "../Utils/reks-interface";
import { createToast } from "../Utils/reks-toast";
import { BButton, useToast } from "bootstrap-vue-next";
import { ref, computed } from "vue";
import { upload_img } from "../Hooks/Editor";
import { upload_music,upload_music_form } from "../Hooks/Music";
import { C } from "vue-router/dist/router-CWoNjPRp.mjs";
const { isOriginal, name, desc, audioFile, coverFile,coverURL,audioURL } =
  storeToRefs(musicStore());

const toast = useToast();
const pre_audio = ref<string | null>(null)
const coverPreview = ref<string | null>(null)

const defaultTitle = computed(() => audioFile?.value?.name ?? "")
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
    try {
      coverPreview.value = URL.createObjectURL(temp);
    } catch (e) {
      coverPreview.value = null;
    }
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
    pre_audio.value = URL.createObjectURL(temp)
    set(audioFile, temp);
  }
};

const upload_new_music = async (data: MusicData) => {
  if (!data.name) {
    createToast(toast, "上传失败", "未上传任何数据", "warning");
    return
  }
  // 先上传图片，再上传音频，再传表单
  try {
    const form = new FormData();
    form.append("img", coverFile.value as File);
    const res = await upload_img(form);
    if (res.errno === 0) {
      coverURL.value = res.data.url
      createToast(toast, "上传成功", "图片上传成功", "success");
    }
  } catch (error) {
    console.error("图片上传失败:", error);
    createToast(toast, "上传失败", "图片上传失败", "danger");
  }

  try {
    const form = new FormData();
    form.append("audio", audioFile.value as File);
    const res = await upload_music(form)
    console.log(res)
    audioURL.value = res?.link
    console.log(audioURL.value)
    createToast(toast, "上传成功", "音频上传成功", "success");
  } catch (e) {
    console.error("音频上传失败:", e);
  }

  try{
    const res = await upload_music_form(data)
    console.log(res)
    createToast(toast, "上传成功", "音乐上传成功", "success");
  }catch(e){
    console.error("音乐上传失败",e)
  }


}

</script>
<template>
  <div class="music-form">
    <!-- 原创/转载选择 -->
    <div class="mt-3 d-flex flex-column align-items-center justify-content-center">
      <div class="h5 mb-3">上传音频 <i-bi-file-music /></div>
      <div class="input-group">
        <input type="file" id="uploadAudio" class="form-control" :multiple="false" @change="handleAudioUpload"
          accept="audio/mp3,audio/wav" />
      </div>
    </div>

    <div v-if="pre_audio" class="mt-3">
      <!-- 是否原创？ -->
      <div class="btn-group mt-3 mb-3" id="isor" role="group">
        <input type="radio" class="btn-check" id="original" v-model="isOriginal" value="true" />
        <label class="btn btn-outline-primary" for="original">原创</label>

        <input type="radio" class="btn-check" id="repost" v-model="isOriginal" value="false" />
        <label class="btn btn-outline-primary" for="repost">转载</label>
      </div>
      <div class="d-flex align-items-start gap-3 mb-3">
        <div class="flex-shrink-0" style="min-width:240px; max-width:320px;">
          <audio :src="pre_audio || ''" controls controlsList="nodownload" class="w-100"></audio>
          <div class="mt-2 text-muted small">预览音频</div>
        </div>
        <div class="flex-fill">
          <div class="mb-3">
            <label for="uploadTitle" class="form-label">歌曲名称</label>
            <input v-model="name" type="text" class="form-control" id="uploadTitle" minlength="1"
              :placeholder="defaultTitle" />
          </div>

          <div class="mb-3">
            <label for="uploadContent" class="form-label">简介</label>
            <textarea v-model="desc" class="form-control" id="uploadContent" rows="4"
              style="resize: none"></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">添加歌曲封面</label>
            <input type="file" id="uploadIcon" class="form-control" @change="handleCoverUpload" accept="image/*" />
          </div>

          <div class="d-flex align-items-center gap-3">
            <BButton variant="primary" @click.stop="upload_new_music({isOriginal,name,desc,coverURL,audioURL})">确认上传</BButton>
            <div v-if="coverPreview" class="border rounded" style="width:64px; height:64px; overflow:hidden;">
              <img :src="coverPreview" alt="cover" style="width:100%; height:100%; object-fit:cover" />
            </div>
            <div v-else class="text-muted small">未上传封面</div>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<style lang="scss" scoped>
audio::-webkit-media-controls-download-button,
audio::-webkit-media-controls-enclosure::-webkit-media-controls-download-button {
  display: none !important;
}

audio::-internal-media-controls-download-button {
  display: none !important;
}
</style>
