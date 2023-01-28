<template>
  <article
    class="bg-black/80 p-5 md:px-10 md:py-8 cursor-pointer"
    @click="open = !open"
  >
    <h1 class="text-white text-xl font-bold">
      {{ content.title }}
    </h1>
    <p
      v-if="open"
      class="text-grey mt-2 md:mt-4"
    >
      {{ content.description }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  content: {
    title: string,
    description: string
  }
}>()

const open = ref(false)
</script>
