<script setup lang="ts">
import { ref, watch } from "vue";
import { query_blog_by_id } from "../Hooks/Blog";

import { useRoute } from "vue-router";

const route = useRoute()
const response = ref()
const isLiked = ref(false)
const isFavorited = ref(false)

// 封装加载函数
const loadBlog = async (id: number | string) => {
    if (!id) return
    const numId = Number(id)
    if (isNaN(numId)) return

    const res = await query_blog_by_id(numId)
    response.value = res
    console.log(response.value)
}

// 监听路由参数变化（浏览器地址栏输入新ID时会触发）
watch(
    () => route.params.id,
    (newId) => {
        loadBlog(Number(newId))
    },
    { immediate: true } // 立即执行，替代 onMounted
)


</script>

<template>
    <div class="blog-container p-4" v-if="response != null">
        <!-- 左侧主内容区 -->
        <div class="blog-main">
            <h2 class="blog-title">{{ response?.title }}</h2>

            <div class="tags">
                <span v-for="tag in response?.tags" :key="tag" class="tag">
                    {{ tag }}
                </span>
            </div>

            <hr />

            <div class="blog-body" v-html="response?.content"></div>
        </div>

        <!-- 右侧用户卡片侧边栏 -->
        <aside class="author-sidebar">
            <div class="author-card">
                <BAvatar size="80" src="" />
                <div class="author-name">{{ response?.author }}</div>
                <BButton variant="outline-secondary" size="sm">+ 关注</BButton>
            </div>

            <!-- 互动按钮组 -->
            <div class="action-buttons">
                <button class="action-btn" :class="{ active: isLiked }" @click="isLiked = !isLiked">
                    <i-bi-hand-thumbs-up />
                    <span>点赞</span>
                </button>
                <button class="action-btn" :class="{ active: isFavorited }" @click="isFavorited = !isFavorited">
                    <i-bi-heart />
                    <span>收藏</span>
                </button>
            </div>
        </aside>
    </div>
    <div class="blog mt-5" v-else>
        <Empty title="不存在该博客"></Empty>
    </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.blog-container {
    margin-top: 7.3rem;
    display: flex;
    gap: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;

    .blog-main {
        flex: 1;
        @extend %reks-card-box;
        padding: 1.5rem;

        .blog-title {
            font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
            margin-bottom: 1rem;
            padding-top: 1rem;
        }

        .tags {
            margin-bottom: 1rem;

            .tag {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                margin-right: 0.5rem;
                font-size: small;
                background-color: white;
                border: 1px solid #dee2e6;
                border-radius: 0.25rem;
                cursor: pointer;

                &:hover {
                    background-color: #f8f9fa;
                }
            }
        }

        .blog-body {
            overflow: hidden;
            width: 100%;

            :deep(p) {
                width: 100%;

                img {
                    max-width: 100%;
                    height: auto;
                }
            }
        }
    }

    .author-sidebar {
        width: 280px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .author-card {
            @extend %reks-card-box;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            position: sticky;
            top: 8rem;

            .author-name {
                font-weight: bold;
                font-size: 1.25rem;
                text-align: center;
            }
        }

        .action-buttons {
            @extend %reks-card-box;
            padding: 1rem;
            display: flex;
            justify-content: space-around;
            position: sticky;
            top: calc(8rem + 250px);

            .action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                border: none;
                background: transparent;
                cursor: pointer;
                border-radius: 0.5rem;
                transition: all 0.2s ease;
                color: #6c757d;


                span {
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                &:hover {
                    background-color: #f8f9fa;
                    color: #495057;

                    svg {
                        transform: scale(1.1);
                    }
                }

                &.active {
                    color: #dc3545;

                    svg {
                        fill: currentColor;
                        stroke: currentColor;
                    }

                    &:hover {
                        background-color: #fff5f5;
                    }
                }
            }
        }
    }
}

// 响应式：小屏幕时堆叠布局
@media (max-width: 768px) {
    .blog-container {
        flex-direction: column;

        .author-sidebar {
            width: 100%;
            order: -1;

            .author-card {
                position: static;
                flex-direction: row;
                justify-content: flex-start;
                padding: 1rem;
                gap: 1.5rem;
            }

            .action-buttons {
                position: static;
                flex-direction: row;
                justify-content: center;
                gap: 2rem;
            }
        }
    }
}
</style>