<script setup lang="ts">

</script>

<template>
  <p>TODO News</p>
  <div class="news">
    <BCard
      v-for="n in 60"
      :img-src="`https://picsum.photos/1000/300?random=${n}`"
      img-alt="Card image"
      img-top
    >
      <BCardText>
        ReKindlers Next正在路上！
      </BCardText>
    </BCard>
  </div>
</template>

<style lang="scss" scoped>
.news{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

</style>