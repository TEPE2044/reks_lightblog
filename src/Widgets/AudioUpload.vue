<script lang="ts" setup>
import {ref} from "vue";
import reapi from "../Requests/reapi";
import Editor from "./Editor.vue";



/* 上传逻辑
* uploadState 上传状态，在用户确定点击上传后，状态会变为true，此时按钮会出现 过渡动画 直到上传结束
* uploading 用于转换按钮的状态函数
* useRoute 实例化useUserStore
* isLogin 判断userId是否存在的函数
* postType,title,description,iconFile,audioFile 都是需要上传字段的名称
*/
const uploadState = ref(false)
const uploading = () => {
  uploadState.value = !uploadState.value
}

// 使用 ref 管理所有数据
const postType = ref(0);
const title = ref('');
const description = ref('');
const iconFile = ref(null);
const audioFile = ref(null);

const handleAudioUpload = (e:Event) => {
  audioFile.value = e.target?.files[0];
};

const validateForm = () => {
  // 验证必填字段
  if (!title.value || !description.value) {
    throw new Error('请填写标题和描述');
  }
  // 不是动态的，图片需要图片，电台需要电台（嗯）
  if (what.value !== 'forum') {
    if (!iconFile.value) {
      throw new Error('请上传封面');
    }
    if (what.value === 'radio' && !audioFile.value) {
      throw new Error('请上传音频文件');
    }
  }
}

// 上传函数
const uploadRadio = async () => {
  try {

    // if (!useRoute.userId) {
    //   toast.show("NoAuth", "您尚未登录，无法使用上传功能")
    //   return
    // }
    validateForm()
    uploading()
    // 创建 FormData
    const formData = new FormData();
    formData.append('postType', postType.value.toString());
    formData.append('title', title.value);
    formData.append('description', description.value);
    if (iconFile.value) formData.append('icon', iconFile.value);
    if (audioFile.value) formData.append('audio', audioFile.value);
    // formData.append('user_id', useRoute.userId)

    // 发送请求
    const res = await reapi({
      url: `/${what.value}/upload`,
      method: "post",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('上传成功', res);
    uploading()
    // 重置表单
    resetForm();

  } catch (error) {
    console.error('上传失败:', error);
  } finally {
    if (uploadState.value !== false) {
      uploading()
    }
  }
};

// 重置表单
const resetForm = () => {
  title.value = '';
  description.value = '';
  iconFile.value = null;
  audioFile.value = null;
  // 重置文件输入
  if(document.getElementById('uploadIcon')) document.getElementById('uploadIcon').value = '';
  if(document.getElementById('uploadAudio')) document.getElementById('uploadAudio').value = '';
};

const what = ref('radio')
</script>

<template>
  <div class="container mt-2 mypost">
    <form @submit.prevent="uploadRadio">
      <fieldset>
        <div class="mt-3 mb-2">
          <select v-model="what" class="form-select">
            <option value="radio">上传电台</option>
            <option value="gallery">上传图片</option>
            <option value="forum">发布新动态</option>
          </select>
        </div>
        <!-- 原创/转载选择 -->
        <div class="btn-group mt-3 mb-2" id="isor" role="group" v-if="what !== 'forum'">
          <input type="radio" class="btn-check " id="original" value="0" v-model="postType">
          <label class="btn btn-outline-primary" for="original">原创</label>

          <input type="radio" class="btn-check" id="repost" value="1" v-model="postType">
          <label class="btn btn-outline-primary" for="repost">转载</label>
        </div>
        <p style="color: #6c757d" v-if="what !== 'forum'">是否原创?（这很重要，请谨慎选择）</p>

        <div class="mb-3">
            <editor/>
        </div>

        <!-- 封面图片上传 -->
        <p v-if="what === 'radio'">上传电台封面</p>
        <p v-if="what === 'gallery'">上传图片</p>
        <p v-if="what === 'forum'">添加图片</p>

        <!-- 音频文件上传 -->
        <p v-if="what === 'radio'">上传音频文件</p>
        <div class="input-group mb-3" v-if="what === 'radio'">
          <input
              type="file"
              id="uploadAudio"
              class="form-control"
              @change="handleAudioUpload"
              accept="audio/mp3,audio/wav"
              required>
        </div>

        <!-- 提交按钮 -->
        <div class="form-footer mt-4">
          <div class="form-check" style="float: left">
            <input class="form-check-input" type="checkbox" id="gridCheck1" required>
            <label class="form-check-label" for="gridCheck1">
              我已阅读
              <router-link to="/rule">相关规定</router-link>
            </label>
          </div>

          <div class="btn-group" style="float: right">
            <button type="submit" class="btn btn-primary" v-if="!uploadState">发布</button>
            <button type="submit" class="btn btn-primary" v-else disabled>
              <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
              <span role="status">上传中...</span>
            </button>
            <button type="reset" class="btn btn-outline-primary" @click="resetForm">重置</button>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.mypost{
    max-width: 70rem;
}
</style>