<script setup lang="ts">

</script>

<template>
    <div class="hub-caro">
        <BCarousel class="inner" controls ride="carousel">
            <BCarouselSlide v-for="value in 3" :key="`old${value}`">
                <template #img>
                    <BImg src="/ysg.jpg" alt="image slot" />
                </template>
            </BCarouselSlide>
        </BCarousel>
    </div>
</template>

<style lang="scss" scoped>
.hub-caro {
    height: 150px;

    .inner {
        height: 100%;
        overflow: hidden;

        /* 直接作用于 Bootstrap Carousel 的 DOM 结构，确保高度链与居中裁剪生效 */
        :deep(.carousel-inner) {
            height: 100%;
        }

        :deep(.carousel-item) {
            height: 100%;
        }
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 38%;
        }

    }
}
</style>