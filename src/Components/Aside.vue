<script setup lang="ts">
import ProfileCard from '../UI/ProfileCard.vue';


</script>

<template>
  <div class="aside mt-2">
    <div class="profile-card">
      <ProfileCard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aside{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>