<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const options = [
  { text: "消息中心", value: "anmt" },
  { text: "我的消息", value: "mes" },
];

const route = useRoute();
const router = useRouter();
const selected = ref(route.name === "mes" ? "mes" : "anmt");

watch(selected, (value) => {
  if (value === route.name) return;
  router.push({ name: value });
});

watch(
  () => route.name,
  (name) => {
    if (name === "anmt" || name === "mes") {
      selected.value = name;
    }
  },
);
</script>

<template>
  <div class="rt-talk pb-5 pt-4">
    <div class="rt-header">
      <BFormRadioGroup
        name="swap"
        class="swap"
        v-model="selected"
        :options="options"
        buttons
        button-variant="outline-dark"
      >
      </BFormRadioGroup>
    </div>
    <div class="rt-content px-5 mx-auto mt-3">
      <div class="rt-main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../Asset/CustomStyle/global.scss";
.rt-talk{
  margin-top: 7.3rem;
  @extend %reks-card-box;
  border: 1px solid #dfe7ee;
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(34, 66, 93, 0.09);
}


.rt-header {
    display: flex;
    align-items: center;
    justify-content: center;
}

.swap {
  padding: 0.25rem;

  border-radius: 999px;
  border: 1px solid #d7e2ea;
}

.swap :deep(.btn) {
  border: none;
  border-radius: 999px !important;
  padding: 0.46rem 1.15rem;
}


.rt-content {
  padding-left: 1.2rem !important;
  padding-right: 1.2rem !important;
}

@media (max-width: 768px) {
  .rt-talk {
    margin-top: 6.7rem;
  }

  .swap :deep(.btn) {
    padding: 0.4rem 0.9rem;
    font-size: 0.86rem;
  }

  .rt-content {
    padding-left: 0.6rem !important;
    padding-right: 0.6rem !important;
  }
}

</style>
