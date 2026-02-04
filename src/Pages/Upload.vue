<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Editor from "../Components/Editor.vue";
import { ref, watch } from "vue";
import { useToast } from "bootstrap-vue-next";
import { createToast } from "../Utils/reks-toast";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";

const selections = ref([
  { name: "随心写", icon: "bi-file-earmark-richtext", postType: "blog" },
  { name: "音乐博客", icon: "bi:file-earmark-play", postType: "mblog" },
  { name: "音频", icon: "bi-file-earmark-music", postType: "audio" },
  { name: "专栏", icon: "bi-file-earmark-post", postType: "pro" },
]);

const toast = useToast();

const postType = ref(selections.value[0]?.postType);

const selectType = (ntype: number) => {
  if (ntype === 3) {
    createToast(toast, "敬请期待", "暂未开放", "warning");
    return;
  }
  postType.value = selections.value[ntype]?.postType;
  //console.log(postType.value)
};

const { isOriginal, trackTitle, trackDesc, audioFile, wantUpload } =
  storeToRefs(musicStore());

watch(postType, () => {
  set(isOriginal, false);
  set(trackTitle, "");
  set(trackDesc, "");
  set(audioFile, null);
  set(wantUpload, "uex");
  console.log("----upload")
  console.log(wantUpload.value)
});
</script>
<template>
  <div class="upload">
    <div class="sidebar">
      <div class="selection d-flex flex-column gap-3">
        <!-- <p class="title">上传格式</p> -->
        <BButton
          :class="{ slt: postType === s.postType }"
          class="select-item d-flex flex-row gap-3 align-items-center justify-content-center rounded-3 border-0"
          v-for="(s, index) in selections"
          :key="`selecetion${s}`"
          @click="selectType(index)"
        >
          <div class="sname">{{ s.name }}</div>
          <Icon :icon="s.icon" />
        </BButton>
      </div>
    </div>

    <div class="textarea mt-3 mb-3">
      <Editor v-model="postType" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.title {
  @extend %reks-title;
}
.upload {
  margin-top: 7.3rem;
  @extend %reks-card-box;
  display: grid;
  grid-template-columns: 1fr 8fr;
  gap: 4rem;
  .textarea {
    @extend %reks-card-box;
  }
  .sidebar {
    padding: 2.5rem;
    .selection {
      position: fixed;
      > button {
        transition: transform 0.2s ease;
        flex: 0 1;
        background-color: rgb(228, 196, 138);
        backdrop-filter: blur(0.2px);
        &.slt {
          background-color: rgb(153, 113, 38);
        }
        > div {
          filter: blur(0.2px);
          font-size: large;
          font-family:
            "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
          font-weight: bold;
        }
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}
</style>
