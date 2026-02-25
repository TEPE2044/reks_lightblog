<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const options = [
  { text: "公告", value: "anmt" },
  { text: "站内信", value: "mes" },
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
  <div class="rt-talk">
    <div class="rt-header">
      <BFormRadioGroup
        name="swap"
        class="swap"
        v-model="selected"
        :options="options"
        buttons
        button-variant="light"
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
.rt-talk{
    // margin-top: 7.3rem;
    margin-top: 3rem;
}


.rt-header {
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
