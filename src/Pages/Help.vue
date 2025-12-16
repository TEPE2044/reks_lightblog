<template>
  <div class="help">
    <BAccordion class="mt-2" title="常见问题" flush>
      <BAccordionItem title="我忘记了密码">
        Placeholder content for this accordion, which is intended to demonstrate
        the
        <code>flush</code> property. This is the first item's accordion body.
      </BAccordionItem>
      <BAccordionItem title="我的手机号已经不再使用">
        <b>您可以在个人中心换绑</b>
        <code>flush</code> property. This is the second item's accordion body.
        Let's imagine this being filled with some actual content.
      </BAccordionItem>
      <BAccordionItem title="我要反馈一些问题">
        <b>您可以通过下面的输入框反馈问题</b>
        <BInputGroup class="mt-4">
          <BFormTextarea
            placeholder="请输入您的反馈内容..."
            rows="3"
            max-rows="3"
          ></BFormTextarea>
          <BButton variant="primary">提交反馈</BButton>
        </BInputGroup>

        <div class="mail mt-4">
          <b>也可以通过邮箱联系我们：</b
          ><a href="mailto:JackyView2004@163.com">JackyView2004@163.com</a>
        </div>
      </BAccordionItem>
    </BAccordion>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.help {
  margin-top: 10rem;
}
</style>
