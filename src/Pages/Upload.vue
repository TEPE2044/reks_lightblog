<script setup lang="ts">
import { ref, watch } from "vue";
import { type UploadIcon, uploadIconMap } from "../Utils/reks-icon-map";
import router from "../Router";
import { useRoute } from "vue-router";
const route = useRoute()
const curPath = ref<string>('/upload/blog')
// 针对非响应式对象的watch写法
watch(() => route.fullPath, (newPath) => {
  curPath.value = newPath
  console.log(curPath.value)
}, { immediate: true })

interface Selection {
  name: string;
  iconKey: UploadIcon;
  path: string;
}

const selections = ref<Selection[]>([
  { name: "随心写", iconKey: "blog", path: "/upload/blog" },
  { name: "音频", iconKey: "audio", path: "/upload/music" },
]);

const switchPost = (rpath: string) => {
  router.push(rpath)
};

</script>
<template>
  <!-- 优化项 TODO:换成upload/blog upload/music upload/mblog 的路由形式 -->
  <div class="upload">
    <div class="sidebar">
      <div class="selection d-flex flex-column gap-3">
        <!-- <p class="title">上传格式</p> -->
        <BButton
          class="select-item d-flex flex-row gap-3 align-items-center justify-content-center rounded-3 border-0"
          v-for="(s) in selections"
          :class="{slt:curPath === s.path }"
          :key="`selecetion${s}`"
          @click="switchPost(s.path)"
        >
          <div class="sname">{{ s.name }}</div>
          <component :is="uploadIconMap[s.iconKey]" style="font-size: 1.4rem" />
        </BButton>
      </div>
    </div>

    <div class="textarea mt-3 mb-3 px-2">
      <RouterView/>
      <!-- <Editor v-model="postType" /> -->
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
