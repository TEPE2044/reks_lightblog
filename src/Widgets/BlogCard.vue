<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";


const card_item = useTemplateRef('card-item')
useEventListener(card_item, 'wheel', (e: WheelEvent) => {
  e.preventDefault()
  if (card_item.value) card_item.value.scrollLeft += e.deltaY
}, { passive: false })
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
        <div ref="card-item" class="rs-card-img-list d-flex flex-row gap-2" v-skeleton-item>
          <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
          <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
          <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
        </div>
        <div class="rs-card-content mt-2" v-skeleton-item @click="">
          <div class="rs-title h5" title="Hello,ReKindlers">
            <strong>Hello,ReKindlers</strong>
          </div>
          <div class="rs-desc mt-2">Since 2024</div>
        </div>
      </div>
      <div
        class="rs-card-footer mt-3 d-flex flex-row align-items-center justify-content-between gap-5"
      >
        <div class="rs-subscribe d-flex flex-row gap-2">
          <BButton v-skeleton-item size="sm" variant="outline-secondary"
            >点赞</BButton
          >
          <BButton v-skeleton-item size="sm" variant="outline-secondary"
            >阅读</BButton
          >
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
$card-max-width: 500px;

.blog-card {
  max-width: $card-max-width;
}

.rs-body {
  .rs-card-img-list {
    overflow-x: auto;
    padding: 0;
    &::-webkit-scrollbar {
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f0f0f0;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(178, 34, 34, 0.76);
      border-radius: 4px;
      border: 2px solid #f0f0f0;
      &:hover {
        background: #764ba2;
      }
    }

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(178, 34, 34, 0.76) #f0f0f0;

    .rs-img {
      max-width: 301px;
      height: 200px;
      object-fit: contain;
      transition: all 0.5s ease;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .rs-card-content {
    max-width: $card-max-width;

    .rs-title {
      width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
