<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <BCard no-body no-header class="music-card position-relative" v-skeleton="false">
    <div class="cover" v-skeleton-item>
      <img src="/ysg1.jpg" alt="UnderGround" />
    </div>

    <!-- 悬停层 + 底部信息 合并 -->
    <div class="meta d-flex flex-column position-absolute p-2">
      <div class="header">
        <BAvatar size="50" class="mb-0 me-3" src="/ysg.jpg" />
        <BButton size="sm" variant="dark">+ 关注</BButton>
        <div class="info">
          <div class="title h4 fw-semibold">UnderGround</div>
          <p class="author">Jacky View</p>

        </div>
      </div>

      <div class="controls d-inline-flex align-items-center gap-3">
        <div class="cion">
          <Icon icon="bi:play-circle" width="30" height="30" />
        </div>
        <div class="cion">
          <Icon icon="bi:plus-circle" width="30" height="30" />
        </div>
        <div class="cion mt-1">
          <Icon icon="bi-heart" width="30" height="30" />
        </div>
      </div>
    </div>
  </BCard>
</template>

<style lang="scss" scoped>
@use "sass:math";

@use "../Asset/CustomStyle/global.scss" as g;
$card-max: 450px;
$radius: 8px;
$overlay: rgba(177, 177, 177, 0.5);

.music-card {
  overflow: hidden;
  border-radius: $radius;
  max-width: $card-max;

  /* 封面图 */
  .cover {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      transition: transform 0.5s ease;
    }
  }

  /* 悬停层 */
  .meta {
    width: 100%;
    height: 100%;
    inset: 0;
    background: $overlay;
    backdrop-filter: blur(10px);
    will-change: transform;
    transform: translateY(100%);
    transition: transform 0.5s ease;

    .controls {
      align-self: flex-end;
      transition: transform 0.3s ease;

      .cion {
        will-change: transform;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  /* 交互 */
  &:hover {
    .cover img {
      transform: scale(1.05);
    }

    .meta {
      transform: translateY(0);
    }
  }
}
</style>
