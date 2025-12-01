<script lang="ts" setup>
import { ref } from 'vue';

const imageList = ref<string[]>([
    '/melo.webp',
    '/mod.webp',
    '/fufu.webp',
    '/mod.webp'
]);


const currentIndex = ref(0);
const displayImage = ref(imageList.value[currentIndex.value]);
const choose = (index: number) => {
    currentIndex.value = index;
    displayImage.value = imageList.value[currentIndex.value];
};


</script>

<template>
    <div class="caro mt-4">
        <div class="caro-full p-3">
            <div class="main-img-container w-100 h-100">
                <Transition name="fade" mode="out-in">
                    <BImg :key="displayImage"  :src="displayImage" class="main-img w-100 h-100" alt="main" />
                </Transition>
            </div>
        </div>
        <div class="caro-thumbail d-flex align-items-center">
            <div class="thumbail-img-container d-flex flex-column gap-2">
                <BImg lazy v-for="(i, index) in imageList" :key="index" :src="i" alt="reks-caro" class="thumbail-img"
                    :class="{ active: index === currentIndex }" @click="choose(index)" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$caro-height: 400px;

.caro {
    //size
    width: 100%;
    height: $caro-height;
    box-sizing: border-box;
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
        max-height: $caro-height;
        border-radius: 12px 0 0 12px;

        .main-img-container {
            border-radius: 12px;
            background: #f8f8f8;

            .main-img {
                object-fit: cover;
                object-position: top center;
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
                max-height: 80px;
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
    transition: opacity 0.3s;
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