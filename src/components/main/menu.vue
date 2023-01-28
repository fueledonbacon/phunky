<template>
  <a
    class="xl:hidden cursor-pointer z-120"
    @click="show = !show"
  >
    <img
      src="/images/menu.svg"
      class="w-5 md:w-8"
      width="32"
      height="32"
      alt="menu"
    >
  </a>

  <transition>
    <div
      v-if="show"
      class="fixed-screen flex flex-center bg-black z-100"
      @click="show = !show"
    >
      <div class="flex flex-col items-center">
        <img
          class="mb-4"
          src="/images/logo-standing.png"
          width="260"
          height="88"
          alt="logo"
        >
        <template
          v-for="navItem in NavLinks"
          :key="navItem.title"
        >
          <router-link
            v-if="!navItem.hideOnHeader"
            class="font-extrabold mt-6 duration-300"
            active-class="text-white/50"
            :to="navItem.to"
          >
            {{ navItem.title }}
          </router-link>
        </template>
        <div class="flex items-center mt-9">
          <a
            href="https://opensea.io/collection/the-phunky-fungi"
          >
            <img
              src="/images/brands/opensea.svg"
              width="24"
              height="24"
              alt="OpenSea"
            >
          </a>
          <a
            href="https://twitter.com/phunkyfungi"
            class="ml-6"
          >
            <img
              src="/images/brands/twitter.svg"
              width="21"
              height="18"
              alt="Twitter"
            >
          </a>
          <a
            href="https://discord.gg/qjhKjxBmEm"
            class="ml-6"
          >
            <img
              src="/images/brands/discord.svg"
              width="25"
              height="19"
              alt="Discord"
            >
          </a>
        </div>
        <main-connect class="mt-20" />
      </div>
      <div class="absolute bottom-0 w-full bg-rainbow-bar h-18" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NavLinks } from '@/consts'

const show = ref(false)
</script>
