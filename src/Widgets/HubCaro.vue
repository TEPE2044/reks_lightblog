<script setup lang="ts">

</script>

<template>
    <div class="hub-caro">
        <BCarousel class="inner" controls ride="carousel">
            <BCarouselSlide v-for="value in 3" :key="`old${value}`">
                <template #img>
                    <BImg src="/ys.jpg" alt="image slot" />
                </template>
            </BCarouselSlide>
        </BCarousel>

        <div class="atlas p-3">
            <div class="atlas-head d-flex flex-row gap-4">
                <h5>活动1</h5>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
                    omnis vitae pariatur facilis ex quae, beatae, molestias voluptatum
                    similique harum fugiat quod perferendis iste laudantium ratione
                    ipsum libero incidunt dolore?
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hub-caro {
    .inner {
        height: 300px;
        overflow: hidden;

        /* 直接作用于 Bootstrap Carousel 的 DOM 结构，确保高度链与居中裁剪生效 */
        :deep(.carousel-inner) {
            height: 100%;
        }

        :deep(.carousel-item) {
            height: 100%;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center 38%;
        }

    }

    .atlas {
        .atlas-head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 0.75rem;
            border: none;

            h5 {
                @extend %reks-section-title;
                margin: 0;
                color: #223428;
                flex-shrink: 0;
            }

            p {
                margin: 0;
                color: #4d6152;
                font-size: 0.9rem;
                line-height: 1.55;
            }

            span {
                font-size: 0.88rem;
                color: #4b5e4f;
            }
        }
    }
}

@media (max-width: 768px) {
    .hub-caro {
        .atlas {
            .atlas-head {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.55rem;
            }
        }
    }
}
</style>