<template>
  <div class="help mx-auto p-5">
    <BAccordion class="mt-2" title="常见问题">
      <BAccordionItem title="账号问题" visible>
        <div class="qa mb-2">
          <h5 class="fw-bold">Q: 我不知道如何注册</h5>
          <p>
            首次使用，请使用<b>短信登录</b>，完成注册步骤后可以通过<b>手机号+密码</b>的形式登录
          </p>
        </div>
        <div class="qa mb-2">
          <h5 class="fw-bold">Q: 我忘记了密码，怎么办？</h5>
          <p>您可以使用<b>短信登录</b>，然后在个人中心重置密码。</p>
        </div>
        <div class="qa mb-2">
          <h5 class="fw-bold">Q: 我的手机号已经不再使用</h5>
          <p>请点击<span title="找回密码" class="reset" @click="fb.toggle()"><b class="text-warning">此处</b></span>通过邮箱验证重置密码。</p>
        </div>
      </BAccordionItem>
      <BAccordionItem title="我要反馈一些问题">
        <a class="mail" href="mailto:TEPE2044@outlook.com"> 
          <b>点击<b class="text-warning">此处</b>通过邮箱联系我</b>
        </a>
      </BAccordionItem>
    </BAccordion>

    <BModal id="fb" title="重置手机号" no-close-on-backdrop cancel-title="取消" ok-title="确定重置" @ok="fbs(fbd)">
      <BFormGroup label="邮箱">
        <BFormInput class="mb-2" v-model="fbd.email" type="email" placeholder="请输入邮箱"/>
      </BFormGroup>
      <BFormGroup class="mt-2" label="重置手机号">
        <BFormInput class="mb-2" v-model="fbd.old_phone" type="tel" placeholder="旧手机号"/>
        <BFormInput class="mb-2" v-model="fbd.new_phone" type="tel" placeholder="新手机号"/>
      </BFormGroup>
    </BModal>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from 'bootstrap-vue-next';
import { reactive } from 'vue';
import { findBack, type ResetData } from '../Hooks/Auth';

const fb = useToggle('fb')

const fbd = reactive({
  email: '',
  old_phone: '',
  new_phone:''
})

const fbs = async(fbd:ResetData) => {
  console.log("耍你的")
  const res = await findBack(fbd)
  alert(res)
}
</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.help {
  @extend %reks-card-box;
  width: 1000px;
  height: 600px;
  margin-top: 10rem;
}
.reset{
  cursor: pointer;
}
</style>
