<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

const imageList = ref<string[]>([
    '/melo.webp',
    '/mod.webp',
    '/melo.webp',
]);


const currentIndex = ref(0);
const displayImage = ref(imageList.value[currentIndex.value]);
const choose = (index: number) => {
    currentIndex.value = index;
    displayImage.value = imageList.value[currentIndex.value];
};


</script>

<template>
    <div class="caro mt-3">
        <div class="caro-full">
            <div class="main-img-container w-100 h-100">
                <Transition name="fade" mode="out-in">
                    <BImg :key="displayImage"  :src="displayImage" class="main-img w-100 h-100" alt="main" />
                </Transition>
            </div>
        </div>
        <div class="caro-thumbail d-flex align-items-center justify-content-center">
            <div class="thumbail-img-container d-flex flex-column gap-2">
                <BImg lazy v-for="(i, index) in imageList" :key="index" :src="i" alt="reks-caro" class="thumbail-img"
                    :class="{ active: index === currentIndex }" @click="choose(index)" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.caro {
    //size
    width: 650px;
    height: 360px;

    //layout
    display: grid;
    grid-template-areas: "main thumbail";
    grid-template-columns: 3fr 1fr;
    //decoration
    border-radius: 12px;
    background-color: #fafafa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);

    .caro-full {
        grid-area: main;
        height: 100%;
        max-height: 360px;
        border-radius: 12px 0 0 12px;

        .main-img-container {
            border-radius: 12px;
            background: #f8f8f8;

            .main-img {
                object-fit: cover;
                object-position: center;
                border-radius: 12px;
            }
        }
    }

    .caro-thumbail {
        grid-area: thumbail;
        height: 100%;
        background: #faf6f2;
        border-radius: 0 12px 12px 0;

        .thumbail-img-container {
            width: 90%;

            .thumbail-img {
                width: 100%;
                height: 70px;
                object-fit: cover;
                object-position: top;
                border-radius: 6px;
                border: 2px solid transparent;
                transition: border-color 0.2s;
                cursor: pointer;

                &.active {
                    border-color: firebrick;
                }

                &:hover {
                    border-color: #e67e22;
                }
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>