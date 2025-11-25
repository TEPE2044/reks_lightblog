<script setup lang="ts">

</script>

<template>
  <p>TODO News</p>
  <div class="news">
    <BCard
      img-src="https://picsum.photos/1000/300"
      img-alt="Card image"
      img-top
    >
      <BCardText>
        ReKindlers Next正在路上！
      </BCardText>
    </BCard>
    <BCard
      img-src="https://picsum.photos/1000/301"
      img-alt="Card image"
      img-bottom
    >
      <BCardText>
        ReKindlers 已至
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