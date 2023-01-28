<template>
  <section class="flex flex-center px-3 py-16 md:px-12 md:py-40">
    <div class="w-full max-w-4xl font-lato">
      <h1 class="text-2xl font-bold text-center uppercase">
        About the Founders
      </h1>
      <article
        v-for="founder in founders"
        :key="founder.name"
        class="flex flex-col md:flex-row items-start mt-16"
      >
        <img
          class="md:mr-9 <md:mx-auto"
          :src="founder.avatar"
          width="181"
          height="188"
          :alt="founder.name"
        >
        <div class="mt-8">
          <h1 class="text-2xl font-extrabold">
            <i class="text-secondary mdi mdi-twitter mr-3" />
            {{ founder.name }}
          </h1>
          <p class="mt-4">
            {{ founder.description }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import founders from '@/assets/json/founders.json'
</script>
