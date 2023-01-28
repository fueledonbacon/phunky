<template>
  <header class="header">
    <router-link
      class="mr-auto"
      :to="{ name: 'Home' }"
    >
      <img
        src="/images/logo-long.png"
        class="w-54 md:w-81"
        width="324"
        height="30"
        alt="logo"
      >
    </router-link>
    <template
      v-for="navItem in NavLinks"
      :key="navItem.title"
    >
      <router-link
        v-if="!navItem.hideOnHeader"
        class="<xl:hidden font-extrabold mr-8 duration-300"
        active-class="text-white/50"
        :to="navItem.to"
      >
        {{ navItem.title }}
      </router-link>
    </template>
    <a
      href="https://opensea.io/collection/the-phunky-fungi"
      class="<xl:hidden"
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
      class="<xl:hidden ml-6"
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
      class="<xl:hidden ml-6"
    >
      <img
        src="/images/brands/discord.svg"
        width="25"
        height="19"
        alt="Discord"
      >
    </a>
    <!-- <main-connect class="<xl:hidden ml-12" /> -->
    <dapp-connect-button class="<xl:hidden ml-12" />
    <main-menu />
  </header>
</template>

<script setup lang="ts">
import { NavLinks } from '@/consts'
</script>
