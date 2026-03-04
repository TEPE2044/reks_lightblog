<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { playerStore } from '../Store/player';
const {isHidden} = storeToRefs(
    playerStore()
);
</script>

<template>
    <div class="mt-3" :class="{footer: !isHidden}">
        <p class="text-center text-muted color-secondary">
            &copy; 2025 焠星者版权所有 | 粤ICP备2025449469号-1
        </p>
    </div>
</template>

<style scoped>
.footer{
    margin-bottom: 4rem;
}
</style>