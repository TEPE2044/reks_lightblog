<script setup lang="ts">
import { ref, watch } from "vue";
import { set, useToggle as vuseToggle } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";
import type { ApiProduct } from "../Utils/reks-interface";
import { createToast } from "../Utils/reks-toast";
import { useToast } from "bootstrap-vue-next";

const { trackTitle,trackDesc, audioFile, coverFile, wantUpload } =
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

const options = [
  { text: "选择已有音频", value: "uex" },
  { text: "上传新音频", value: "unew" },
  { text: "上传新合辑", value: "unewc", disabled: true },
];


const [confirm, toggleConfirm] = vuseToggle();

// Simulated API response
const apiProducts: ApiProduct[] = [
  { productCode: "PROD-001", productName: "Widget A", category: "Hardware" },
  { productCode: "Man-Dick", productName: "sdget B", category: "Sex Toy" },
  { productCode: "PROD-002", productName: "Gadget B", category: "Electronics" },
  {
    productCode: "PROD-003",
    productName: "Tool C",
    category: "Hardware",
    discontinued: true,
  },
];
// TypeScript knows selectedProductCode is a string (matching productCode field type)
const selectedProductCode = ref<string>();
</script>
<template>
  <div class="radio-selector">
    <BFormRadioGroup
      class="mb-2"
      v-model="wantUpload"
      :options="options"
      name="wantUpload"
    />

    <section class="unew mt-3" v-if="wantUpload === 'unew'">
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
    </section>

    <section class="uex mt-3" v-if="wantUpload === 'uex'">
      <div>
        <BInputGroup>
          <BFormInput
            v-model="selectedProductCode"
            type="text"
            list="product-list"
            placeholder="搜索歌曲歌曲"
            :disabled="confirm"
          />
          <template #append>
            <BButton @click="toggleConfirm()">确定</BButton>
          </template>
        </BInputGroup>

        <BFormDatalist
          id="product-list"
          :options="apiProducts"
          value-field="productCode"
          text-field="productName"
          disabled-field="discontinued"
        />
        <div class="mt-3">
          已选择: <strong>{{ selectedProductCode }}</strong>
        </div>
      </div>
    </section>

    <section class="unewc mt-3" v-if="wantUpload === 'unewc'"></section>
  </div>
</template>

<style lang="scss" scoped></style>
