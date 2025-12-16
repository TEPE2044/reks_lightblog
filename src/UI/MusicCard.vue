<template>
  <button @click="loading = !loading">切换</button>
  <hr />
  <BCard class="rs-card" v-skeleton="loading">
    <template #img>
      <div class="rs-img border-bottom">
        <img v-skeleton-item class="w-100 h-100" src="/mod.webp" alt="ai" />
      </div>
    </template>
    <template #default>
      <div class="rs-body d-flex flex-row gap-4 align-items-center">
        <div class="rs-left ps-1">
          <BPopover class="mt-2" placement="bottom">
            <template #target><BAvatar v-skeleton-item /></template>

            <template #title
              ><BLink class="rs-title fw-bold text-danger"
                >ReKindlers-JackyView</BLink
              ></template
            >
            <template #default
              >哈喽，我是ReKindlers的创始人JackyView,你也可以叫我MeLoDyZ</template
            >
          </BPopover>
        </div>
        <div class="rs-right w-75">
          <div class="rs-title" v-skeleton-item>少女前线 SOPMOD2</div>
          <div class="rs-content text-secondary" v-skeleton-item>
            狗子可爱捏
          </div>
        </div>
      </div>
    </template>
  </BCard>
</template>

<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
// 完成 Perfect
</script>

<style lang="scss" scoped>
.rs-card {
  box-sizing: border-box;
  width: 400px;
  height: fit-content;

  .rs-img {
    width: 100%;
    object-fit: cover;
    object-position: top center;
  }
  .rs-body {
    .rs-right {
      .rs-title {
        will-change: contents;
        width: 275px;
        overflow: hidden;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: larger;
        &:hover {
          white-space: wrap;
        }
      }
    }
  }
}
</style>
