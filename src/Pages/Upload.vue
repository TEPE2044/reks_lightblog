<script setup lang="ts">
import { Icon } from "@iconify/vue";

import Editor from "../Widgets/Editor.vue";
import { ref } from "vue";

const selections = ref([
  { name: "随心写", icon: "bi-file-earmark-richtext",typed:'blog'},
  { name: "音乐博客", icon: "bi:file-earmark-play",typed:'mblog'},
  { name: "音频", icon: "bi-file-earmark-music",typed:'audio'},
  { name: "专栏", icon: "bi-file-earmark-post",typed:'pro'},
]);

const typed = ref(selections.value[0]?.typed);

const selectType = (ntype:number) => {
  typed.value = selections.value[ntype]?.typed
  console.log(typed.value)
}
</script>
<template>
  <div class="upload">
    <div class="sidebar">
      <div class="selection d-flex flex-column gap-3">
        <!-- <p class="title">上传格式</p> -->
        <BButton
          class="select-item d-flex flex-row gap-3 align-items-center justify-content-center rounded-3 border-0"
          v-for="(s,index) in selections"
          :key="`selecetion${s}`"
          @click="selectType(index)"
        >
          <div class="sname">{{ s.name }}</div>
          <Icon :icon="s.icon" />
        </BButton>
      </div>
    </div>

    <div class="textarea mt-3 mb-3">
      <Editor v-model="typed"/>
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
