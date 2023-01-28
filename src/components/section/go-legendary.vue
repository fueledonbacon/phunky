<template>
  <section class="section bg-go-legendary bg-normal px-0">
    <h1 class="font-davida text-2xl sm:text-4xl text-center">
      60 Legendary Phunky Fungi<br>
      1 of 1 NFTs<br>
      by Digital Artist <span class="text-accent">Munzir</span>
    </h1>
    <swiper
      class="mt-8"
      :slides-per-view="Math.floor(width / 360) || 1"
      centered-slides
      loop
      :grab-cursor="true"
    >
      <swiper-slide
        v-for="mush in mushes"
        :key="mush.id"
        class="flex flex-col items-center"
      >
        <div class="w-70 sm:w-80 bg-white relative">
          <div class="swiper-lazy-preloader" />
          <img
            class="relative w-70 sm:w-80 border border-white card-shadow swiper-lazy z-20"
            :src="'/images/nfts/' + mush.image"
            width="320"
            height="320"
            alt="Phunky Fungi"
          >
        </div>
        <div class="text-center text-2xl mt-3">
          {{ mush.name }}
        </div>
        <div class="font-lato font-bold text-center text-caption text-grey mt-1">
          #{{ mush.id }}
        </div>
      </swiper-slide>
      <template #container-end>
        <swiper-pagination class="mt-16" />
      </template>
    </swiper>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import mushes from '@/assets/json/mushes.json'

const { width } = typeof window === 'undefined'
  ? { width: ref(0) }
  : useWindowSize()
</script>
