<template>
  <div class="hub-header p-4 d-flex align-items-center justify-content-center">
    <div class="hub-caro shadow-lg border rounded-3 overflow-hidden">
      <BImg width="500" src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1400&q=80" class="object-fit-cover" alt="piano" />
      <div class="hub-caro-overlay">
        <span class="badge bg-danger mb-2">音乐资讯</span>
        <h5 class="text-white m-0">本周精选：钢琴专场</h5>
      </div>
    </div>

    <div class="clover">
      <div class="clover-box shadow-sm border border-2 rounded hot-content" v-for="(item, index) in cloverImages" :key="`4clover_${index}`">
        <img class="clover-img" :src="item.src" :alt="item.alt">
        <!-- <div class="clover-overlay">
          <div class="clover-title">内容标题 {{ tab }}</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cloverImages = [
  {
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
    alt: "vinyl and player"
  },
  {
    src: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1000&q=80",
    alt: "drum set"
  },
  {
    src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1000&q=80",
    alt: "headphones and mixer"
  },
  {
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    alt: "guitar performance"
  }
];
</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hub-header {
  display: grid;
  grid-template-columns: 400px 1fr;
  @extend %reks-card-box;
  gap: 3rem;

  .hub-caro {
    width: 500px;
    max-height: 320px;
    position: relative;
    cursor: pointer;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      pointer-events: none;
    }
    
    .hub-caro-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      z-index: 2;
      
      .badge {
        font-size: 0.75rem;
        padding: 0.4em 0.8em;
        border-radius: 20px;
      }
    }
  }

  .clover {
    max-height: 350px;
    display: grid;
    gap: 1rem;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 300px 300px;

    >div {
      cursor: pointer;
      will-change: transform;
      transition: all 0.3s ease-in-out;
      position: relative;
      overflow: hidden;

      .clover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        transition: transform 0.5s ease;
      }
      
      .clover-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.8rem;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        
        
        .clover-title {
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          line-height: 1.3;
        }
      }

      &:hover {
        transform: scale(1.08);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        
        .clover-img {
          transform: scale(1.1);
        }
        
        .clover-overlay {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
    
    // 大格子特殊样式
    >div:nth-child(1) {
      .clover-tag {
        background: #ff6b6b;
        color: white;
      }
    }
  }
}
</style>