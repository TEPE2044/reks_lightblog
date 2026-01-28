<template>
  <div class="fclover">
    <div
      class="clover-box shadow-sm d-flex align-items-center flex-column justify-content-center border border-2 rounded"
      v-for="tab in tabs"
      :key="`4clover_${tab.name}`"
    >
      <strong class="name text-light ">{{ tab.name }}</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>


const tabs = [
  { name: "Radio" },
  { name: "写博客" },
  { name: "合成器" },
  { name: "积分榜" },
];
</script>

<style lang="scss" scoped>
.fclover {
  width: 220px;
  height: 220px;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, 1fr);

  > div {
    background: conic-gradient(
      from 90deg,
      rgba(#8a1e1e, 0.75) 0deg,
      rgba(#8a1e1e, 0.75) 51.429deg,
      rgba(#a12d2d, 0.75) calc(51.429deg + 0.1deg),
      rgba(#a12d2d, 0.75) 102.857deg,
      rgba(#b93c3c, 0.75) calc(102.857deg + 0.1deg),
      rgba(#b93c3c, 0.75) 154.286deg,
      rgba(#d04b4b, 0.75) calc(154.286deg + 0.1deg),
      rgba(#d04b4b, 0.75) 205.714deg,
      rgba(#e85a5a, 0.75) calc(205.714deg + 0.1deg),
      rgba(#e85a5a, 0.75) 257.143deg,
      rgba(#f06969, 0.75) calc(257.143deg + 0.1deg),
      rgba(#f06969, 0.75) 308.571deg,
      rgba(#f87a7a, 0.75) calc(308.571deg + 0.1deg) 360deg
    );

    /* 下面都是你原来的 */
    backdrop-filter: blur(2px);
    will-change: background transform;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      /* hover 同样套 rgba 保持半透明 */
      background: conic-gradient(
        from 90deg,
        rgba(#8a1e1e, 1) 0deg,
        rgba(#8a1e1e, 1) 51.429deg,
        rgba(#a12d2d, 1) calc(51.429deg + 0.1deg),
        rgba(#a12d2d, 1) 102.857deg,
        rgba(#b93c3c, 1) calc(102.857deg + 0.1deg),
        rgba(#b93c3c, 1) 154.286deg,
        rgba(#d04b4b, 1) calc(154.286deg + 0.1deg),
        rgba(#d04b4b, 1) 205.714deg,
        rgba(#e85a5a, 1) calc(205.714deg + 0.1deg),
        rgba(#e85a5a, 1) 257.143deg,
        rgba(#f06969, 1) calc(257.143deg + 0.1deg),
        rgba(#f06969, 1) 308.571deg,
        rgba(#f87a7a, 1) calc(308.571deg + 0.1deg) 360deg
      );
      transform: scale(1.08);
    }
  }
}
</style>
