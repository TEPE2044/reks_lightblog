<script setup lang="ts">
import { Icon } from "@iconify/vue";
import AudioUpload from "../Widgets/AudioUpload.vue";

const selections = [
  { name: "音乐博客", icon: "bi-file-earmark-post" },
  { name: "音频", icon: "bi-file-earmark-music" },
  { name: "纯博客", icon: "bi-file-earmark-richtext" },
];
</script>
<template>
  <div class="upload">
    <div class="selection d-flex flex-row gap-3 mt-4 mx-auto">
      <BButton
        class="select-item d-flex flex-row gap-3 align-items-center justify-content-center rounded-5 border-0"
        v-for="s in selections"
        :key="`selection${s}`"
      >
        <div class="sname">{{ s.name }}</div>
        <Icon :icon="s.icon" />
      </BButton>
    </div>

    <div class="textarea rounded-5 overflow-hidden mt-4">
      <AudioUpload />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload {
  margin-top: 7.3rem;
  overflow: hidden;
  .selection {
    width: 600px;
    height: 50px;
    > button {
      transition: transform 0.2s ease;
      flex: 1 0;
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
</style>
