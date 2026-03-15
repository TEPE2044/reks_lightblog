<template>
  <div class="hub">
    <HubHeader />

    <div class="hang border-3 rounded-3 overflow-hidden mt-4 mb-4">
      <HubCaro />
    </div>

    <Recommand />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { createToast } from '../Utils/reks-toast';
import { useToast } from 'bootstrap-vue-next';
const toast = useToast()

onMounted(() =>{
  createToast(toast,"暂未开放","该页面仍在建造中，敬请期待",'warning')
})

</script>

<style lang="scss" scoped>
.hub {
  margin-top: 7.3rem;
}
</style>
