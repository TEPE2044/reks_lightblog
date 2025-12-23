<script setup lang="ts">

</script>
<template>
    <div class="showcase">
        <div class="scroll-bar w-100 mb-4 p-4">
            <div class="case-title h5">
                熔岩电台
            </div>
            <div class="case mt-4">
                <div class="case-box" v-for="value in 2" :key="value">
                    <img class="case-img" src="/ysg.jpg" alt="">
                </div>
                <div class="case-box" v-for="value in 2" :key="value">
                    <img class="case-img" src="/ly.jpg" alt="">
                </div>
                <div class="case-box" v-for="value in 2" :key="value">
                    <img class="case-img" src="/ys.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss" as g;

.scroll-bar {
    @extend %reks-card-box;
    opacity: 0.95;
    height: g.$caro-height;

    .case-title {
        @extend %reks-title;
    }

    .case {
        display: flex;
        gap: 1rem;
        overflow-x: overlay;
        overflow-y: hidden;
        .case-box {
            flex: 0 0 300px;
            .case-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

    }
}
</style>