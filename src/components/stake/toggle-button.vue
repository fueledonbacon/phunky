<template>
  <button
    @click="$emit('toggle')"
    :style="backgroundStyles"
    class="
      border
      transition
      duration-150
      ease-in-out
    ">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  value: { type: Boolean, required: true },
  color: { type: String, required: true }
})

const backgroundStyles = computed(() =>
  props.value
    ? {
        'background-color': props.color,
        color: '#ffffff',
        'border-color': props.color
      }
    : {
        'background-color': 'transparent',
        color: props.color,
        'border-color': props.color
      }
)
</script>
