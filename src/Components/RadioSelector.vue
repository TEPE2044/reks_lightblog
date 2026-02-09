<script setup lang="ts">
import { ref } from "vue";
import { useToggle as vuseToggle } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { musicStore } from "../Store/music";
import type { ApiProduct } from "../Utils/reks-interface";
import { iwantsomedata } from "../Utils/reks-test";

const { wantUpload } = storeToRefs(musicStore());

const options = [
  { text: "选择已有音频", value: "uex" },
  { text: "上传新音频", value: "unew" },
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
    <section class="uex mt-3" v-if="wantUpload === 'uex'">
      <div>
        <BInputGroup>
          <BFormInput
            @focus="iwantsomedata()"
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
    <section class="unew mt-3" v-if="wantUpload === 'unew'">
      <MusicForm/>
    </section>
    <section class="unewc mt-3" v-if="wantUpload === 'unewc'"></section>
  </div>
</template>

<style lang="scss" scoped></style>
