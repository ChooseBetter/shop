<template>
  <div class="xtx-steps-item" :class="{active: index < active}">
    <div class="step">
      <span>{{ index + 1 }}</span>
    </div>
    <div class="title">{{ title }}</div>
    <div class="desc">{{ desc }}</div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, inject} from "vue";
const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
});
const active = inject("active");
</script>

<style scoped></style>
