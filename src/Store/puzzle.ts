import { defineStore } from "pinia";
import { ref } from "vue";
import type { RNext } from "../Utils/reks-next-job";
/*
puzzle
# var
- isShow 控制puzzle显示变量
- rnext 存储下一个函数
# func
- onShow 控制puzzle显示的函数
- openPuzzle 处理异步事件的函数
- onSuccess puzzle验证成功时执行的函数
*/
export const puzzleStore = defineStore("puzzle", () => {
  const isShow = ref(false);
  const nextStep = ref<RNext | null>(null);

  const openPuzzle = (job: RNext) => {
    nextStep.value = job;
    isShow.value = true;
  };

  const onCancel = () => {
    nextStep.value = null; // 重置
    isShow.value = false;
  };

  const onSuccess = () => {
    isShow.value = false;
    if (nextStep.value) {
      nextStep.value();
      nextStep.value = null;
    }
  };

  return {
    isShow,
    openPuzzle,
    onCancel,
    onSuccess
  };
});
