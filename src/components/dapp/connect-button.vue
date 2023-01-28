<template>
  <button
    v-if="isActivated"
    class="flex items-stretch button w-45 sm:w-60"
  >
    <div
      class="flex-grow text-right pr-2 sm:pr-6 py-2 sm:py-4 border-r border-primary rounded-l-full"
      cls:hover="bg-primary/10"
      @click="disconnect"
    >
      {{ shortenAddress(address) }}
    </div>
    <div
      class="flex items-center pl-1 sm:pl-4 pr-3 sm:pr-6"
      cls:hover="bg-primary/10 rounded-r-full"
      @click="collapsed = !collapsed"
    >
      <i
        class="text-2xl mdi mdi-chevron-down duration-300 transform"
        :class="{ 'rotate-180': !collapsed }"
      />
    </div>

    <transition>
      <div
        v-if="!collapsed"
        ref="menuRef"
        class="button-menu"
      >
        <div class="button-menu__contents">
          <div
            v-for="option in supportedChains"
            :key="option.value"
            class="button-menu__option"
            :class="{ 'button-menu__option--active': chainId === option.value }"
            @click="onChainSelected(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </transition>
  </button>
  <button
    v-else
    class="button flex items-stretch justify-center w-45 sm:w-60 py-2 sm:py-4"
    cls:hover="bg-primary/10"
    @click="open"
  >
    <span v-if="wallet.status === 'connecting'">
      Connecting...
    </span>
    <span v-else-if="wallet.status === 'loading'">
      Loading...
    </span>
    <span v-else>
      Connect
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useConnect } from '@/use/useConnect'
import { shortenAddress } from '@/utils'

const collapsed = ref(true)
const menuRef = ref(null as any)
const {
  open,
  address,
  chainId,
  isActivated,
  disconnect,
  wallet,
  changeChainId,
  supportedChains
} = useConnect()

onClickOutside(menuRef, () => {
  collapsed.value = true
})

const onChainSelected = (newChain: number) => {
  changeChainId(newChain)
  collapsed.value = true
}
</script>
