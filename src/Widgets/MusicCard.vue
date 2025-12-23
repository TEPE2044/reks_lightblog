<template>
  <BCard class="rs-card" v-skeleton="loading">
    <template #img>
      <div class="rs-img border-bottom">
        <img v-skeleton-item class="w-100 h-100" src="/melo.webp" alt="ai" />
      </div>
    </template>
    <template #default>
      <div class="rs-body d-flex flex-row gap-4 align-items-center">
        <div class="rs-left ps-1">
          <BPopover class="mt-2" placement="bottom">
            <template #target><BAvatar src="/ysg.jpg" v-skeleton-item /></template>

            <template #title
              ><BLink class="rs-title fw-bold "
                >@JackyView</BLink
              ></template
            >
            <template #default
              >哈喽，我是ReKindlers的创始人JackyView,你也可以叫我MeLoDyZ</template
            >
          </BPopover>
        </div>
        <div class="rs-right w-75">
          <div class="rs-title" v-skeleton-item>三个火铳手1414</div>
          <div class="rs-content text-secondary" v-skeleton-item>
            枫丹
          </div>
        </div>
      </div>
    </template>
  </BCard>
</template>

<script setup lang="ts">
// import { ref } from "vue";
const loading = defineProps<{
  loading: boolean;
}>();
// 完成 Perfect
</script>

<style lang="scss" scoped>
.rs-card {
  box-sizing: border-box;
  // width: 400px;
  // height: 480px;
  max-height: 480px;

  .rs-img {
    width: 100%;
    object-fit: cover;
    object-position: top center;
  }
  .rs-body {
    .rs-right {
      .rs-title {
        will-change: contents;
        // width: 275px;
        overflow: hidden;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
