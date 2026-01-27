<template>
    <div>
        <button @click="testQueryBlogs">获取博客</button>
    </div>
</template>

<script setup lang="ts">
import { query_my_blog } from '../Hooks/Blog';

const testQueryBlogs = async() =>{
    const res = await query_my_blog()
    console.log(res)
}
</script>

<style scoped>

</style>