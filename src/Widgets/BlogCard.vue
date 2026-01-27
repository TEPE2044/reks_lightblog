<script setup lang="ts">
// const datas = defineProps<{ images:[],title:string,desc:string }>()
</script>

<template>
  <BCard class="blog-card mt-4" v-skeleton="false">
    <div class="rs-body">
      <div ref="card-item" class="rs-card-img-list" v-skeleton-item>
        <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
        <img class="rs-img" src="/ai.webp" alt="Music Card Demo" />
        <img class="rs-img" src="/melo.webp" alt="Music Card Demo" />
      </div>
    </div>


    <div class="rs-card-content mt-4" v-skeleton-item @click="">
      <div class="rs-title h5" title="Hello,ReKindlers">
        <strong>Hello,ReKindlers</strong>
      </div>
      <div class="rs-desc mt-2">Since 2024</div>
    </div>
  </BCard>
</template>

<style lang="scss" scoped>
.blog-card {
  break-inside: avoid;
  float: right;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.rs-body {
  .rs-card-img-list {
    display: grid;
    gap: 12px;
    overflow: hidden;
    grid-template-columns: 1.5fr 1fr; // 默认按“三图”列比

    // > 表示子元素
    &:not(:has(>:nth-child(2))) {
      >:nth-child(1) {
        // equals grid-row: 1/3;
        grid-column: span 3;
        grid-row: auto;
      }
    }

    &:not(:has(>:nth-child(3))) {
      grid-template-columns: 2fr 1fr; // 两图时，均分
    }

    &:has(>:nth-child(3)) {
      >:nth-child(1) {
        // equals grid-row: 1/3;
        grid-row: span 2;
      }
    }

    .rs-img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: all 0.5s ease;
      will-change: transform;

      &:hover {
        cursor: pointer;
        transform: scale(1.2);
      }
    }


  }
}

.rs-card-content {
  // max-width: $card-max-width;

  .rs-title {
    width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>
