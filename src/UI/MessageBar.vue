<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const sys = ref(false);
</script>
<template>
    <div
      class="message-bar rounded d-flex justify-content-around align-items-center p-1 gap-2"
    >
      <BButton class="position-relative bb" variant="light">
        <Icon icon="bi:megaphone"/>
        <BBadge
          v-show="sys"
          dot-indicator
          variant="danger"
          class="position-absolute top-0 start-100 translate-middle"
        />
      </BButton>
      <BButton class="position-relative bb" variant="light">
        <Icon icon="bi:envelope"/>
      </BButton>
      <BButton class="position-relative bb" variant="light">
        <Icon icon="bi:person-circle"/>
      </BButton>
    </div>

</template>

<style scoped>
.message-bar {
  .bb{
    background-color: rgba(255, 255, 255, 0.671);
  }
}
</style>
