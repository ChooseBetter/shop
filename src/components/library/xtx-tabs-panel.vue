<template>
  <div class="xtx-tabs-panel" v-show="activeName === name">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {inject, defineProps} from "vue";
const props = defineProps({
  // 标签页标题文章
  label: {
    type: String,
    default: "",
  },
  // 唯一标识
  name: {
    type: String,
    default: "",
  },
});

const activeName = inject("activeName");
</script>

<style scoped></style>
