<template>
  <section class="bg-faq bg-top bg-no-repeat bg-center bg-cover bg-fixed px-3 pt-36 pb-20 md:px-12 md:py-45">
    <div class="w-full text-black max-w-3xl mx-auto">
      <h1 class="text-2xl font-lato font-extrabold text-center mb-10">
        FAQs
      </h1>
      <faq-item
        v-for="faq in faqs"
        :key="faq.title"
        class="mt-4 md:mt-5"
        :content="faq"
      />
      <div class="text-center text-white mt-8 md:mt-10">
        Still have an unanswered question? Join our
        <a
          href="https://discord.gg/qjhKjxBmEm"
          class="font-bold text-tertiary"
        >Discord</a>
        and ask in general-chat!
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import faqs from '@/assets/json/faqs.json'
</script>

<route>
{
  "name": "FAQ"
}
</route>
