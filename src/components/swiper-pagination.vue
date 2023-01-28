<template>
  <div class="flex items-center justify-center">
    <button
      class="<sm:hidden fab btn--secondary mr-10"
      @click="swiper.slidePrev()"
    >
      <i class="text-2xl mdi mdi-chevron-left" />
    </button>
    <a
      href="https://opensea.io/collection/the-phunky-fungi?search[stringTraits][0][name]=Category&search[stringTraits][0][values][0]=Legendary"
      class="btn btn--secondary h-12 bg-white py-0"
    >
      <img
        class="mr-2"
        src="/images/brands/opensea-inverted.svg"
        width="24"
        height="24"
        alt="opensea"
      >
      View All on OpenSea
    </a>
    <button
      class="<sm:hidden fab btn--secondary ml-10"
      @click="swiper.slideNext()"
    >
      <i class="text-2xl mdi mdi-chevron-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'
import Swiper from 'swiper'

const swiper = inject('swiper') as Ref<Swiper>
</script>
