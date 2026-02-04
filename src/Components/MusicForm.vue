<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";
import RadioSelector from "../Widgets/RadioSelector.vue";
import { Icon } from "@iconify/vue";
const { isOriginal, trackTitle, trackDesc } =
  storeToRefs(musicStore());
  
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

  <section class="mt-2">
    <RadioSelector />
  </section>

  <div class="submit mt-3">
    <BPopover placement="bottom">
      <template #target>
        <BButton variant="success" class="float-end">发布</BButton>
      </template>
      <template #title>
        <strong>确认发布?</strong>
      </template>
      <BButton size="md" variant="success"  @click="">
        <Icon icon="bi-send" /> 发布
      </BButton>
    </BPopover>
  </div>
</template>

<style lang="scss" scoped></style>
