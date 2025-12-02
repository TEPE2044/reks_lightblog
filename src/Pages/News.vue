<script setup lang="ts">

</script>

<template>
  <div class="news">

    <!-- <div class="ns news-blog">
      <BCard
      v-for="n in 9"
      :img-src="`https://picsum.photos/1000/300?random=${n}`"
      img-alt="Card image"
      img-top
    >
      <BCardText>
        ReKindlers Next正在路上！
      </BCardText>
    </BCard>
    </div>
    <hr> 
    <div class="ns news-music">
      <BCard
      v-for="n in 9"
      :img-src="`https://picsum.photos/1000/300?random=${n}`"
      img-alt="Card image"
      img-top
    >
      <BCardText>
        ReKindlers Next正在路上！
      </BCardText>
    </BCard>

    </div> -->

  </div>
</template>

<style lang="scss" scoped>
.ns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>