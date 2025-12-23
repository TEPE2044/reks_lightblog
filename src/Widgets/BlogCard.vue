<script setup lang="ts"></script>

<template>
  <div class="blog-card" v-skeleton="false">
    <BCard>
      <template #header>
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
          <div class="rs-card-img-list d-flex flex-row gap-2" v-skeleton-item>
            <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
            <img class="rs-img" src="/ly.jpg" alt="Music Card Demo" />
          </div>
          <div class="rs-card-content mt-2" v-skeleton-item @click="">
            <div class="rs-title fw-bold">Hello,ReKindlers</div>
            <div class="rs-desc mt-2">Since 2024</div>
          </div>
        </div>
      </template>

      <template #footer>
        <div
          class="rs-card-footer d-flex flex-row align-items-center justify-content-between gap-5"
        >
          <div class="rs-subscribe d-flex flex-row gap-2">
            <BButton v-skeleton-item size="sm" variant="outline-secondary"
              >点赞</BButton
            >
            <BButton v-skeleton-item size="sm" variant="outline-secondary"
              >收藏</BButton
            >
          </div>

          <div class="rs-comments-info d-inline-flex flex-row gap-3">
            <span class="text-muted" v-skeleton-item>127个赞</span>
            <span class="text-muted" v-skeleton-item>3条评论</span>
          </div>
        </div>
      </template>
    </BCard>
  </div>
</template>

<style lang="scss" scoped>
$card-max-width: 500px;
.rs-body {
  max-width: $card-max-width;
  .rs-card-img-list {
    max-width: $card-max-width;
    overflow-x: overlay;
    padding: 0;
    .rs-img {
      width: $card-max-width;
      height: 300px;
      object-fit: contain;
      border-radius: 8px;
      transition: all 0.5s ease;
      &:hover {
        cursor: pointer;
        filter: brightness(0.8);
      }
    }
  }
  .rs-card-content {
    max-width: $card-max-width;
  }
}
</style>
