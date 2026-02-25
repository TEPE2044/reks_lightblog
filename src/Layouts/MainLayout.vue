<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { wsClient } from '../Requests/ws-regql';
import { useToast } from 'bootstrap-vue-next';
import { createToast } from '../Utils/reks-toast';

interface Blog {
  blogId: number;
  title: string;
  authorId: number;
} 
const toast = useToast()

function useBlogSubscription() {
  const latestBlog = ref<Blog | null>(null);

  // 开始订阅，拿到“关闭函数”
  const unsubscribe = wsClient.subscribe<{ testFollowing: Blog }>(
    {
      query: `subscription { testFollowing { blogId title authorId } }`,
    },
    {
      next: ({ data }) => {
        const blog = data?.testFollowing ?? null;
        latestBlog.value = blog;
        if (blog) {
          createToast(toast, "新消息", blog.title, "primary");
        }
      },
      error: console.error,
      complete: () => {},
    },
  );

  // 组件销毁时停止监听
  onUnmounted(() => unsubscribe());

  return {
    latestBlog,
  };
}

const { latestBlog } = useBlogSubscription();
</script>

<template>
  <BContainer class="main-layout mb-5">
    <router-view/>
  </BContainer>
</template>

<style scoped>
</style>