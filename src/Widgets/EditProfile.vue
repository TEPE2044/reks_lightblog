<template>
  <div class="edit-profile p-4">
    <div class="edit-title h5 ps-2">
      我的信息
    </div>
    <!-- <BAlert show variant="success" dismissible>
      请完善您的个人信息，以便我们为您提供更好的服务。
    </BAlert> -->
    <div class="profile">
      <div class="avatar mt-4 d-flex align-items-center justify-content-center">
        <Avatar />
      </div>

      <div
        class="info mt-4 mx-auto col-6"
      >
        <BForm class="d-flex flex-column gap-4 ">
          <BInputGroup prepend="昵称">
            <BFormInput
              id="inline-form-input-username"
              :placeholder="user.userInfo?.username"
            />
          </BInputGroup>
          <BInputGroup>
            <BFormRadioGroup v-model="default_gender" :options="options">
            </BFormRadioGroup>
          </BInputGroup>
          <BInputGroup prepend="生日">
            <BFormInput id="inline-form-input-birthday" type="date"/>
          </BInputGroup>
          <BInputGroup prepend="签名">
            <BFormInput
              id="inline-form-input-signature"
              :placeholder="
                user.userInfo?.signature || '这个人很懒，什么都没有留下'
              "
            />
          </BInputGroup>
        </BForm>
      </div>

      <BButton variant="primary" class="mt-4">保存修改</BButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userStore } from "../Store/user";
import Avatar from "./Avatar.vue";
const user = userStore();
const default_gender:number = user.userInfo.sex
// const default_gender:number = user.userInfo.gender
// alert(user.userInfo.sex)
const options = [
  {text: '男', value: 1},
  {text: '女', value: 2},
  {text: '保密', value: 0},
]
</script>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.edit-title{
  @extend %reks-title;
}
</style>
