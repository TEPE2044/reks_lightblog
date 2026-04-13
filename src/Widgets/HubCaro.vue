<script setup lang="ts">
import { computed, ref } from "vue";

interface HubActivity {
    id: number;
    title: string;
    desc: string;
    date: string;
    image: string;
}

const activities: HubActivity[] = [
    {
        id: 1,
        title: "钢琴即兴午后",
        desc: "围绕钢琴旋律做即兴练习与分享，现场会拆解和弦走向与情绪表达，适合新手和进阶者。",
        date: "2026-04-20",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80"
    },
    {
        id: 2,
        title: "夜谈音乐与创作",
        desc: "邀请独立音乐人分享创作习惯，开放即兴交流环节，适合写作与音乐爱好者参加。",
        date: "2026-04-27",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80"
    },
    {
        id: 3,
        title: "黑胶聆听会",
        desc: "带上你喜欢的黑胶唱片一起交流，围绕编曲层次、混音质感和时代风格展开轻讨论。",
        date: "2026-05-05",
        image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1400&q=80"
    }
];

const currentSlide = ref(0);
const fallbackActivity: HubActivity = {
    id: 0,
    title: "音乐活动预告",
    desc: "更多乐队排练开放日、器乐分享会与聆听会正在筹备中。",
    date: "TBD",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1400&q=80"
};
const currentActivity = computed<HubActivity>(() => {
    return activities[currentSlide.value] ?? activities[0] ?? fallbackActivity;
});

</script>

<template>
    <div class="hub-caro">
        <BCarousel v-model="currentSlide" class="inner" controls ride="carousel">
            <BCarouselSlide v-for="activity in activities" :key="activity.id">
                <template #img>
                    <BImg :src="activity.image" :alt="activity.title" />
                </template>
            </BCarouselSlide>
        </BCarousel>

        <div class="atlas p-3">
            <div class="atlas-head d-flex flex-row gap-4">
                <h5>{{ currentActivity.title }}</h5>
                <p>{{ currentActivity.desc }}</p>
                <span>{{ currentActivity.date }}</span>
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