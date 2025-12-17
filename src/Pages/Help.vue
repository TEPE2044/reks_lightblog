<template>
  <div class="help mx-auto p-5">
    <BAccordion class="mt-2" title="常见问题">
      <BAccordionItem title="账号问题" visible>
        <div class="qa mb-2">
          <h5 class="fw-bold">Q: 我不知道如何注册</h5>
          <p>首次使用，请使用<b>短信登录</b>，完成注册步骤后可以通过<b>手机号+密码</b>的形式登录</p>
        </div>
        <div class="qa mb-2">
          <h5 class="fw-bold">Q: 我忘记了密码，怎么办？</h5>
          <p>您可以使用<b>短信登录</b>，然后在个人中心重置密码。</p>
        </div>
        <div class="qa mb-2">
          <h5 class="fw-bold">Q: 我的手机号已经不再使用</h5>
          <p>请在登录卡片中点击<b>忘记密码</b>，通过邮箱验证重置密码。</p>
        </div>

      </BAccordionItem>
      <!-- <BAccordionItem title="我的手机号已经不再使用">
        <b>您可以在点击忘记密码</b>，通过邮箱重置密码
      </BAccordionItem> -->
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
          <b>也可以通过邮箱联系我：</b
          ><a href="mailto:JackyView2004@163.com">JackyView2004@163.com</a>
        </div>
      </BAccordionItem>
    </BAccordion>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss"; 
.help {
  @extend %reks-card-box;
  width: 1000px;
  height: 600px;
  margin-top: 10rem;
}
</style>
