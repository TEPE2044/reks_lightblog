<script setup lang="ts">
// 博客包揽了图片上传和富文本编辑功能（内容不限），电台则支持音频上传
const what = 'blog' // 'blog' | 'radio'
</script>

<template>
  <div class="aside">
    <BButton variant="success">一键签到</BButton>
    <BButtonGroup>
      <BButton variant="outline-primary">发布博客</BButton>
      <BButton variant="outline-primary">发布电台</BButton>
    </BButtonGroup>

    <BCard>
      <BListGroup flush>
        待定内容板块
        <BListGroupItem>
          <BImg lazy thumbnail src="https://picsum.photos/1000/300"/>
        </BListGroupItem>
        <BListGroupItem>
          <BImg lazy thumbnail src="https://picsum.photos/1000/301"/>
        </BListGroupItem>
        <BListGroupItem>
          <BImg lazy thumbnail src="https://picsum.photos/1000/302"/>
        </BListGroupItem>
      </BListGroup>
    </BCard>
  </div>
</template>

<style lang="scss" scoped>
.aside{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>