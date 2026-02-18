<template>
    <div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { query_my_music } from '../Hooks/Music';

onMounted(async() => {
    const res = await query_my_music()
    console.log(res)
})
</script>

<style lang="scss" scoped>

</style>