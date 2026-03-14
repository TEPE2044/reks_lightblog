<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    summary: string;
    meta?: string;
    badge?: string;
    tone?: "warm" | "sky";
  }>(),
  {
    meta: "",
    badge: "活动",
    tone: "warm",
  },
);
</script>

<template>
  <article class="activity-card" :class="tone">
    <div class="top-row">
      <span class="badge">{{ badge }}</span>
      <span class="meta" v-if="meta">{{ meta }}</span>
    </div>
    <h4>{{ title }}</h4>
    <p>{{ summary }}</p>
  </article>
</template>

<style lang="scss" scoped>
.activity-card {
  border-radius: 10px;
  padding: 0.78rem;
  min-height: 110px;
  border: 1px solid transparent;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  height: 1.45rem;
  padding: 0 0.48rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.meta {
  font-size: 0.72rem;
  opacity: 0.88;
}

h4 {
  margin: 0.55rem 0 0.36rem;
  font-size: 0.95rem;
  line-height: 1.35;
}

p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.45;
}

.activity-card.warm {
  border-color: #f0d7b1;
  background: linear-gradient(135deg, #fff8ec 0%, #fff0da 100%);
  color: #674b39;
}

.activity-card.warm .badge {
  background: rgba(208, 114, 43, 0.14);
  color: #8d4f24;
}

.activity-card.sky {
  border-color: #bdd9ef;
  background: linear-gradient(135deg, #f0f8ff 0%, #dff0ff 100%);
  color: #345a72;
}

.activity-card.sky .badge {
  background: rgba(59, 122, 168, 0.14);
  color: #32658b;
}
</style>