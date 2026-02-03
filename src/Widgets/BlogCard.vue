<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
// const datas = defineProps<{ images:[],title:string,desc:string }>()
const type = ref("mb");

</script>

<template>
  <BCard class="blog-card" v-skeleton="false">
    <template #header v-if="type === 'mb'">
      <!-- 长方形容器 -->
      <div
        style="
          display: flex;
          align-items: center;
          height: 80px;
          padding: 8px 12px;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        "
      >
        <!-- 左侧封面 -->
        <div
          style="
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
          "
          @click=""
        >
          <img
            src="/ai.webp"
            style="width: 100%; height: 100%; object-fit: cover"
            alt="album"
          />
          <!-- 播放按钮 -->
          <div
            class="play-btn"
            style="
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.2s;
            "
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <!-- 右侧歌曲信息 -->
        <div style="margin-left: 12px; flex: 1">
          <div style="font-size: 15px; font-weight: 600; color: #111">
            ReKindlers
          </div>
          <div style="font-size: 13px; color: #666; margin-top: 4px">
            Since 2024 · 3:42
          </div>
        </div>
      </div>
    </template>

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
    <template #footer>
      <div class="controls d-inline-flex align-items-center gap-3">
        <div class="cion">
          <Icon icon="bi:hand-thumbs-up" width="25" height="25" />
        </div>
        <div class="cion mt-1">
          <Icon icon="bi-heart" width="25" height="25" />
        </div>
      </div>
    </template>
  </BCard>
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
  <BCard class="blog-card mt-4" v-skeleton="false">
    <div class="rs-body">
      <div ref="card-item" class="rs-card-img-list" v-skeleton-item>
        <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
      </div>
    </div>

    <div class="rs-card-content mt-4" v-skeleton-item @click="">
      <div class="rs-title h5" title="Hello,ReKindlers">
        <strong>Hello,ReKindlers</strong>
      </div>
      <div class="rs-desc mt-2">Since 2024</div>
    </div>
  </BCard>
  <BCard class="blog-card mt-4" v-skeleton="false">
    <div class="rs-body">
      <div ref="card-item" class="rs-card-img-list" v-skeleton-item>
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

  <BCard class="blog-card mt-4" v-skeleton="false">
    <div class="rs-body">
      <div ref="card-item" class="rs-card-img-list" v-skeleton-item>
        <img class="rs-img" src="/ysg.jpg" alt="Music Card Demo" />
        <img class="rs-img" src="/ai.webp" alt="Music Card Demo" />
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
  max-width: 300px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.rs-body {
  .rs-card-img-list {
    display: grid;
    gap: 12px;
    overflow: hidden;
    grid-template-columns: 1.5fr 1fr; // 默认按“三图”列比

    // > 表示子元素
    &:not(:has(> :nth-child(2))) {
      > :nth-child(1) {
        // equals grid-row: 1/3;
        grid-column: span 3;
        grid-row: auto;
      }
    }

    &:not(:has(> :nth-child(3))) {
      grid-template-columns: 2fr 1fr; // 两图时，均分
    }

    &:has(> :nth-child(3)) {
      > :nth-child(1) {
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

.play-btn:hover {
  opacity: 1 !important;
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
