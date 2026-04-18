<template>
  <div class="hub">
    <HubHeader />

    <section class="hub-shell mt-4 mb-4">
      <article class="hub-main overflow-hidden">
        <div class="hang">
          <HubCaro />
        </div>
      </article>

      <aside class="hub-side p-3">
        <div class="side-head">
          <h5>热门标签</h5>
        </div>

        <ul class="entry-list" aria-label="热门标签">
          <li
            v-for="entry in entries"
            :key="entry.name"
            class="entry-item"
            :class="getTagWeightClass(entry.count)"
          >
            
            <p class="entry-title"><i-bi-tag/>{{ entry.name }}</p>
          </li>
        </ul>

        <!-- <BButton class="random-entry" variant="outline-info">
          <h6>随机词条</h6>
        </BButton> -->
      </aside>
    </section>

    <div class="hub-recommand">
      <Recommand />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { get_hot_tags } from '../Hooks/Blog';

interface TagResponse{
  name:string,
  count:number
}

const entries = ref<TagResponse[]>([])

onMounted(async() => {
  try {
    entries.value = await get_hot_tags()
  } catch {
    entries.value = []
  }
})

const maxCount = computed(() => {
  if (entries.value.length === 0) return 1
  return Math.max(...entries.value.map((item) => Number(item.count || 0)), 1)
})

const getTagWeightClass = (count: number) => {
  const ratio = Number(count || 0) / maxCount.value
  if (ratio >= 0.75) return 'weight-xl'
  if (ratio >= 0.5) return 'weight-lg'
  if (ratio >= 0.25) return 'weight-md'
  return 'weight-sm'
}

</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hub {
  margin-top: 7.3rem;
  padding-bottom: 2rem;
}

.hub-shell {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.hub-main,
.hub-side{
  @extend %reks-card-box;
}

.hub-main {
  padding-top: 0;
  .hang {
    border-bottom: 1px solid rgba(30, 50, 38, 0.08);
  }
}

.hub-side {
  .side-head {
    margin-bottom: 0.8rem;

    h5 {
      @extend %reks-section-title;
      margin: 0;
      color: #203126;
    }

    span {
      font-size: 0.85rem;
      color: #4d5f50;
    }
  }

  .entry-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: minmax(34px, auto);
    grid-auto-flow: dense;
    gap: 0.45rem;
    height: 240px;
    overflow: auto;
    padding-right: 0.25rem;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background-color: rgba(60, 80, 67, 0.25);
    }

    .entry-item {
      border-radius: 10px;
      padding: 0.42rem 0.5rem;
      background: rgba(237, 212, 190, 0.361);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-width: 0;
      cursor: pointer;

      &:hover {
        transform: translateY(-1px);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.42),
          0 6px 12px rgba(0, 0, 0, 0.08);
      }

      &.weight-xl {
        grid-column: span 3;
        grid-row: span 2;

        .entry-title {
          font-size: 1rem;
          font-weight: 700;
        }
      }

      &.weight-lg {
        grid-column: span 2;
        grid-row: span 2;

        .entry-title {
          font-size: 0.92rem;
          font-weight: 650;
        }
      }

      &.weight-md {
        grid-column: span 2;

        .entry-title {
          font-size: 0.86rem;
        }
      }

      &.weight-sm {
        grid-column: span 1;

        .entry-title {
          font-size: 0.8rem;
        }
      }

      &:first-child{
        &::before{
          content: '🔥';
        }
      }
    }

    .entry-title {
      margin: 0;
      color: #2a3d30;
      line-height: 1.2;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .random-entry {
    margin-top: 0.85rem;
    border-radius: 10px;
    padding: 0.6rem;

    h6 {
      margin: 0;
      color: #24352a;
      font-size: 0.85rem;
    }
    &:hover{
      transition: transform 0.1s ease ;
      transform: scale(1.03);
    }
  }
}

.hub-recommand-head {
  border-radius: 10px;
  margin-bottom: 0.6rem;
  padding-top: 0.55rem;
  padding-bottom: 0.55rem;

  h5 {
    @extend %reks-section-title;
    margin: 0;
    color: #233529;
  }

  span {
    font-size: 0.86rem;
    color: #536656;
  }
}

@media (max-width: 1100px) {
  .hub-shell {
    grid-template-columns: 1fr;
  }

  .hub-side {
    .entry-list {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}

@media (max-width: 576px) {
  .hub-side {
    .entry-list {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      height: 220px;
    }

    .entry-item {
      &.weight-xl,
      &.weight-lg,
      &.weight-md {
        grid-column: span 2;
      }
    }
  }
}
</style>
