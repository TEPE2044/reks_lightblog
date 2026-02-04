<script setup lang="ts">
import { useToggle } from 'bootstrap-vue-next';
import router from '../Router';
import { userStore } from '../Store/user';
import { storeToRefs } from 'pinia';
import { useWindowScroll } from '@vueuse/core';
useWindowScroll
const {isLoggedIn} = storeToRefs(userStore());
const emd = useToggle("easy-login-box");
const toHub = () => {
    if(isLoggedIn.value === false) {
        emd.toggle()
        return;
    } 
    router.push('/hub')
}
</script>

<template>

    <div class="hotlist p-4">
        <h5 class="hotlist-title mb-5">热门推荐</h5>
        <div class="hotlist-content ">
            <BCard v-for="n in 8" :key="n" title="虚狩降临" img-src="ysg1.jpg" img-alt="Image" img-top>
                <template #header>
                    <strong>虚狩降临</strong>
                </template>
                <BCardText>
                    云岿山叶瞬光
                </BCardText>
            </BCard>
        </div>
        <div class="more d-flex justify-content-center align-items-center mt-4 fw-bold" @click="toHub">更多内容></div>
    </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.hotlist {
    @extend %reks-card-box;

    .hotlist-title {
        @extend %reks-title;
    }

    .hotlist-content {

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }

    .more{
        cursor: pointer;
    }
}
</style>