<template>
  <div class="hub-header">
    <HubCaro />

    <div class="clover">
      <div class="clover-box shadow-sm border border-2 rounded hot-content" v-for="entry in cloverEntries"
        :key="entry.id" :style="{ '--entry-accent': entry.accent }">
        <img v-if="entry.img" class="clover-img" :src="entry.img" :alt="entry.title">
        <div v-else class="clover-fallback" aria-hidden="true"></div>
        <div class="clover-content">
          <div class="clover-title">{{ entry.title }}</div>
          <div class="clover-subtitle">{{ entry.subtitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CloverEntry {
  id: string
  title: string
  subtitle: string
  img: string
  accent: string
}

const cloverEntries: CloverEntry[] = [
  {
    id: 'dailyRemmend',
    title: '每日音乐推荐',
    subtitle: '好听的demo',
    img: '',
    accent: '#4f86ff'
  },
  {
    id: 'reksRadio',
    title: '焠星者电台',
    subtitle: '一键开启官方精选音乐',
    img: '/imagePlaceholder.webp',
    accent: '#ff6a3d'
  },
  {
    id: 'night-mailbox',
    title: '夜航信箱',
    subtitle: '来信与温柔回信',
    img: '',
    accent: '#2fb89f'
  },
  {
    id: 'reksVersion',
    title: '版本活动',
    subtitle: '设计成一个弹窗，静态资源',
    img: '',
    accent: '#f0b13e'
  }
]

</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hub-header {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.9fr);
  gap: clamp(0.8rem, 1.8vw, 1.2rem);
  width: 100%;
  align-items: stretch;

  .hub-caro {
    min-width: 0;
    height: 100%;
  }

  .clover {
    @extend %reks-card-box;
    padding: 0.8rem;
    min-height: 350px;
    display: grid;
    gap: 0.8rem;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(74px, 1fr);

    >div {
      --entry-accent: #ff6a3d;
      cursor: pointer;
      will-change: transform;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-columns: 92px 1fr;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      background: color-mix(in srgb, var(--entry-accent) 13%, #ffffff);

      .clover-img {
        width: 92px;
        height: 60px;
        border-radius: 10px;
        object-fit: cover;
        object-position: center;
        transition: transform 0.35s ease;
      }

      .clover-fallback {
        width: 92px;
        height: 60px;
        border-radius: 10px;
        background:
          radial-gradient(circle at 75% 20%, color-mix(in srgb, var(--entry-accent) 50%, #ffffff) 0%, transparent 45%),
          linear-gradient(135deg, #191c24 0%, color-mix(in srgb, var(--entry-accent) 65%, #0a0c11) 100%);
        transition: transform 0.35s ease;
      }

      .clover-content {
        min-width: 0;

        .clover-tag {
          display: inline-flex;
          align-items: center;
          margin-bottom: 0.35rem;
          font-size: 0.7rem;
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
          background: color-mix(in srgb, var(--entry-accent) 78%, #ffffff);
          color: #fff;
          letter-spacing: 0.04em;
        }

        .clover-title {
          color: #1f2b24;
          font-size: 0.96rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .clover-subtitle {
          color: #4f5d54;
          font-size: 0.76rem;
          margin-top: 0.2rem;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

        .clover-img {
          transform: scale(1.06);
        }

        .clover-fallback {
          transform: scale(1.06);
        }
      }
    }
  }
}

@media (max-width: 1320px) {
  .hub-header {
    grid-template-columns: minmax(0, 1.45fr) minmax(300px, 1fr);
  }
}

@media (max-width: 1180px) {
  .hub-header {
    grid-template-columns: 1fr;

    .clover {
      min-height: auto;
    }
  }
}

@media (max-width: 768px) {
  .hub-header {
    .clover {
      grid-template-columns: 1fr;

      >div {
        grid-template-columns: 80px 1fr;
        padding: 0.6rem;

        .clover-img,
        .clover-fallback {
          width: 80px;
          height: 56px;
        }
      }
    }
  }
}
</style>