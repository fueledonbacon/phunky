<template>
  <footer class="footer section bg-hero pb-8 xl:pb-4">
    <div class="flex flex-wrap <xl:text-center">
      <div class="flex flex-col <xl:items-center w-full xl:w-1/2">
        <router-link
          class="mr-auto"
          :to="{ name: 'Home' }"
        >
          <img
            src="/images/logo-long.png"
            width="324"
            height="31"
            alt="logo"
          >
        </router-link>
        <div class="flex flex-col sm:flex-row mt-8">
          <router-link
            v-for="(navItem, idx) in NavLinks"
            :key="navItem.title"
            class="font-extrabold duration-300"
            :class="idx && 'mt-8 ml-0 sm:mt-0 sm:ml-8'"
            active-class="text-white/50"
            :to="navItem.to"
          >
            {{ navItem.title }}
          </router-link>
        </div>
        <div class="flex items-center mt-8">
          <a
            href="https://discord.gg/qjhKjxBmEm"
            class="fab border-white bg-tertiary mr-3"
          >
            <img
              src="/images/brands/discord-inverted.svg"
              width="24"
              height="17"
              alt="discord"
            >
          </a>
          <a
            href="https://twitter.com/phunkyfungi"
            class="fab border-white bg-secondary mr-3"
          >
            <img
              src="/images/brands/twitter-inverted.svg"
              width="20"
              height="18"
              alt="twitter"
            >
          </a>
          <a
            href="https://opensea.io/collection/the-phunky-fungi"
            class="fab border-secondary bg-white"
          >
            <img
              src="/images/brands/opensea-inverted.svg"
              width="24"
              height="24"
              alt="opensea"
            >
          </a>
        </div>
      </div>
      <div class="w-full xl:w-1/2 text-primary <xl:mt-9">
        <div class="font-extrabold">
          PHUNKY FUNGI CONTRACT
        </div>
        <div class="mt-2 break-all">
          0xdf0e921f7e5a837805bfbe02012db648a12d72cc
        </div>
        <div class="font-extrabold mt-8">
          MUTANT MUSHIES CONTRACT
        </div>
        <div class="mt-2 break-all">
          0xBDFB17884DcaEfD9923c17D7035583B7B129296E
        </div>
      </div>
    </div>
    <div class="text-white/60 text-center mt-12">
      ©2022 Phunky Fungi. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { NavLinks } from '@/consts'
</script>

<style>
.footer {
  background-image: linear-gradient(#000A, #000A), url(/images/mushroom-bg.jpg);
  background-position: 50% 75%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
