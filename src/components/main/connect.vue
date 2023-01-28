<template>
  <button
    class="btn btn--accent"
    @click="toggleWallet"
  >
    {{ account.accountCompact }}
  </button>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import account, { useAccount } from '@/use/account'

const { toggleWallet } = useAccount()

onMounted(() => {
  nextTick(() => {
    account.connect()
  })
})
</script>
