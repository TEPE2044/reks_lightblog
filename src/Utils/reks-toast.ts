import { useToast } from "bootstrap-vue-next";
import { ref } from "vue";

interface ToastVariant {
  variant:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | "light"
    | "dark";
}

const toastCount = ref(0);
// TODO:还需设置防抖
const createToast = (
  toast: ReturnType<typeof useToast>,
  title: string,
  body: string,
  variant: ToastVariant["variant"]
) => {
  if (toastCount.value >= 5) {
    // console.log(toastCount.value)
    return;
  }

  try {
    toast.create({
      title,
      body,
      variant,
      solid: true,
      progressProps: {
        variant,
      },
      position: "bottom-end",
      onHidden: () => {
        toastCount.value = Math.max(0, toastCount.value - 1);
        // console.log("toast关闭，当前数量：", toastCount.value);
      },
    });
    toastCount.value += 1;
  } catch (e) {
    console.warn("Toast creation failed:", e);
  }
};

export { createToast };
