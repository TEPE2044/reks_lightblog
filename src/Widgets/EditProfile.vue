<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import { userStore } from "../Store/user";
import { storeToRefs } from "pinia";
import { upload_img } from "../Hooks/Editor";
import type { UserProfile } from "../Utils/reks-interface";
import { useDebounceFn } from "@vueuse/core";
import { update_profile } from "../Hooks/User";
import { createToast } from "../Utils/reks-toast";
import { useToast } from "bootstrap-vue-next";
import { getUserProfile } from "../Hooks/Auth";
const { userInfo, tempAvatar } = storeToRefs(userStore());
const { updateUserInfo } = userStore()
const toast = useToast();
const options = [
  { text: '男', value: 1 },
  { text: '女', value: 2 },
  { text: '保密', value: 0 },
]
const userProfile = reactive({
  username: '',
  gender: userInfo.value.gender,
  signature: '',
} as UserProfile)


const profileSave = useDebounceFn(async (data: UserProfile) => {
  let avatarURL = "";
  if (tempAvatar.value) {
    const form = new FormData();
    form.append("img", tempAvatar.value);
    try {
      const res = await upload_img(form);
      console.log(res)
      avatarURL = res.data.url;
    }
    catch (err) {
      console.error("上传头像失败", err);
    }
  }
  try {
    data.username = data.username || userInfo.value.username;
    data.gender = data.gender || 0
    data.signature = data.signature || userInfo.value.sign;
    console.log("保存用户信息", { ...data, avatar: avatarURL });
    const res1 = await update_profile(data, avatarURL);
    console.log(res1);
    try{
      await updateUserInfo()
      createToast(toast, "更新成功", "用户信息已更新", "success");
    }
    catch(e){
      console.error(e)
    }
  }
  catch (err) {
    console.error("保存用户信息失败", err);
  }
}, 800);

onBeforeMount(() => {
  tempAvatar.value = null;
})
</script>
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

      <div class="info mt-4 mx-auto col-6">
        <BForm class="d-flex flex-column gap-4 ">
          <BInputGroup prepend="昵称">
            <BFormInput id="inline-form-input-username" :placeholder="userInfo?.username"
              v-model="userProfile.username" />
          </BInputGroup>
          <BInputGroup>
            <BFormRadioGroup v-model="userProfile.gender" :options="options" default-value="0">
            </BFormRadioGroup>
          </BInputGroup>
          <!-- <BInputGroup prepend="生日">
            <BFormInput min="1900-01-01" id="inline-form-input-birthday" type="date"/>
          </BInputGroup> -->
          <BInputGroup prepend="签名">
            <BFormInput id="inline-form-input-signature" v-model="userProfile.signature" :placeholder="userInfo?.sign || ''
              " />
          </BInputGroup>
        </BForm>
      </div>

      <BButton variant="primary" class="mt-4" @click="profileSave(userProfile)">保存修改</BButton>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";

.edit-title {
  @extend %reks-title;
}
</style>
