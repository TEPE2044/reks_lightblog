<script setup lang="ts">
import Editor from "../Components/Editor.vue";
import { onUnmounted, ref, watch } from "vue";
import { set } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";
import  { type UploadIcon,uploadIconMap } from "../Utils/reks-icon-map";

const selections = ref<{ name: string; iconKey: UploadIcon; postType: string }[]>([
  { name: "随心写", iconKey: "blog", postType: "blog" },
  { name: "音频", iconKey: "audio", postType: "audio" },
  { name: "音乐博客", iconKey: "mblog", postType: "mblog" },
]);

const postType = ref(selections.value[0]?.postType);

const selectType = (ntype: number) => {
  postType.value = selections.value[ntype]?.postType;
  //console.log(postType.value)
};

const { isOriginal, name, desc, audioFile, wantUpload } =
  storeToRefs(musicStore());

watch(postType, () => {
  set(isOriginal, false);
  set(name, "");
  set(desc, "");
  set(audioFile, null);
  set(wantUpload, "uex");
  console.log("----upload");
  console.log(wantUpload.value);
});
onUnmounted(() =>{
  window.onbeforeunload = function(event) {
    event.preventDefault();
  };
})
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
          <component :is="uploadIconMap[s.iconKey]" style="font-size: 1.4rem" />
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
  min-height: 600px;
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
