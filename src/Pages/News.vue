<script setup lang="ts">
import BlogCard from "../Widgets/BlogCard.vue";
</script>

<template>
  <div class="news">
    <BCardGroup columns>
      <BlogCard v-for="iu in 5" :key="iu" />
    </BCardGroup>
  </div>

  <div class="ns">
    <BCard
      v-for="n in 8"
      :key="n"
      title="Card title that wraps to a new line"
      :img-src="`https://picsum.photos/g/400/100?random=${n}`"
      img-alt="Image"
      img-top
    >
      <BCardText>
        This is a wider card with supporting text below as a natural lead-in to
        additional content. This content is a little bit longer.
      </BCardText>
    </BCard>
  </div>

  <BCard
    v-for="n in 3"
    :key="n"
    title="Card title that wraps to a new line"
    img-src="ysg1.jpg"
    img-alt="Image"
    img-top
  >
    <BCardText>
      This is a wider card with supporting text below as a natural lead-in to
      additional content. This content is a little bit longer.
    </BCardText>
  </BCard>
</template>

<style lang="scss" scoped>
.ns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
