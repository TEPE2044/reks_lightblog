<script setup lang="ts">

</script>

<template>
  <div class="ns p-4">
    <BCard v-for="n in 10" :key="n" title="虚狩降临" img-src="ysg1.jpg" img-alt="Image" img-top>
      <template #header>
        <strong>虚狩降临</strong>
      </template>
      <BCardText>
        云岿山叶瞬光
      </BCardText>
    </BCard>
  </div>
</template>

<style lang="scss" scoped>
.ns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
</style>