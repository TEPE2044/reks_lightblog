<script setup lang="ts">

</script>

<template>
  <BCard class="blog-card" v-skeleton="false">
    <template #footer>
      <div class="rs-card-header d-flex flex-row gap-4 align-items-center">
        <div class="rs-avatar ps-1">
          <BAvatar src="/ysg.jpg" v-skeleton-item />
        </div>

        <div class="rs-user-info">
          <div class="rs-username" v-skeleton-item>JackyView</div>
          <div class="rs-post-time text-muted small" v-skeleton-item>
            发布于 2024-06-01
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <div class="rs-body">
        <div ref="card-item" class="rs-card-img-list" v-skeleton-item>
          <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
          <img class="rs-img" src="/ai.webp" alt="Music Card Demo" />
          <img class="rs-img" src="/melo.webp" alt="Music Card Demo" />
        </div>
        <div class="rs-card-content mt-2" v-skeleton-item @click="">
          <div class="rs-title h5" title="Hello,ReKindlers">
            <strong >Hello,ReKindlers</strong>
          </div>
          <div class="rs-desc mt-2">Since 2024</div>
        </div>
      </div>
      <div class="rs-card-footer mt-3 d-flex flex-row align-items-center justify-content-between gap-5">
        <div class="rs-subscribe d-flex flex-row gap-2">
          <BButton v-skeleton-item size="sm" variant="outline-secondary">点赞</BButton>
          <BButton v-skeleton-item size="sm" variant="outline-secondary">阅读</BButton>
        </div>

        <div class="rs-comments-info d-inline-flex flex-row gap-3">
          <span class="text-muted" v-skeleton-item>127个赞</span>
          <span class="text-muted" v-skeleton-item>3条评论</span>
        </div>
      </div>
    </template>
  </BCard>
</template>

<style lang="scss" scoped>
.blog-card {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.rs-body {
  .rs-card-img-list {
    display: grid;
    gap: 12px;
    max-height: 600px;
    overflow: hidden;
    grid-template-columns: 1.5fr 1fr; // 默认按“三图”列比
    // > 表示子元素
    &:not(:has(>:nth-child(2))) {
     >:nth-child(1) {
        // equals grid-row: 1/3;
        grid-column: span 3;
      }
    }

    &:not(:has(>:nth-child(3))) {
      grid-template-columns: 1fr 1fr; // 两图时，均分
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
}
</style>
