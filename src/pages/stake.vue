<template>
  <section class="bg-stake bg-top bg-no-repeat bg-center bg-cover px-3 pt-36 pb-20 md:px-12 md:py-45">
    <h1 class="font-davida text-3xl sm:text-6xl text-center text-stroke-sm text-stroke-black">
      <span class="text-accent">STAKE</span> TO EARN
    </h1>
    <div class="bg-black/50 rounded-md py-3 font-davida text-2xl flex justify-around gap-10">
      <p>Global Items Staked: {{ totalStaked }}</p>
      <p>$KARMA: {{ karmaAmount }}</p>
      <p>Unclaimed $KARMA: {{ wallet.claimableReward }}</p>
    </div>
    <div class="bg-black/50 py-3 sm:py-8 mt-8 rounded-md">
      <div class="flex">
        <div class="overflow-hidden px-1 flex-grow">
          <div class="text-center pb-2 sm:text-2xl font-extrabold">Inventory ({{nfts.length}})</div>
          <div
            class="h-226px sm:h-270px lg:h-310px flex justify-center items-center relative"
            v-if="wallet.status !== 'connected'"
          >
            <p class="text-2xl">Connect your wallet</p>
          </div>
          <div
            class="h-226px sm:h-270px lg:h-310px flex justify-center items-center relative"
            v-else-if="!wallet.isNftsLoaded"
          >
            <div class="swiper-lazy-preloader" />
          </div>
          <div
            class="h-226px sm:h-270px lg:h-310px flex justify-center items-center"
            v-else-if="!nfts.length"
          >
            <p class="text-2xl">Inventory is empty</p>
          </div>
          <swiper
            :slides-per-view="Math.floor((width - 120) / 280) || 1"
            centered-slides-bounds
            :grab-cursor="true"
            :modules="[Autoplay, Scrollbar]"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :scrollbar="{ hide: true }"
            v-else
          >
            <swiper-slide
              v-for="(nft, i) in nfts"
              :key="i"
              class="flex flex-col items-center"
            >
              <div class="w-40 sm:w-50 lg:w-60 bg-white shadow-lg shadow-gray-400 relative rounded-lg">
                <div class="swiper-lazy-preloader" />
                <img
                  class="relative border border-white card-shadow swiper-lazy z-20 rounded-lg"
                  :src="'https://cloudflare-ipfs.com/ipfs/' + nft.image.slice(7)"
                  alt="Phunky Fungi"
                >
                <p class="w-full absolute text-center bottom-0 font-bold z-21 text-2xl">#{{nft.tokenID}}</p>
              </div>
              <stake-toggle-button @click="onStakeCheck(i)" :value="stakeItems.includes(i)" color="#28c074" class="my-3 py-2 rounded-full w-40 sm:w-50 lg:w-60 sm:text-xl">
                Select
              </stake-toggle-button>
            </swiper-slide>
          </swiper>
        </div>
        <div class="min-w-25 sm:min-w-44 h-214px sm:h-258px lg:h-298px px-1 sm:px-2">
          <div class="ml-1 sm:ml-5 pb-2 sm:text-2xl font-extrabold">Staked ({{stakedNfts.length}})</div>
          <div
            class="h-226px sm:h-270px lg:h-310px justify-center items-center relative"
            v-if="wallet.status === 'connected' && !wallet.isStakedNftsLoaded"
          >
            <div class="swiper-lazy-preloader" />
          </div>
          <swiper
            :slides-per-view="3"
            :spaceBetween="width < 640 ? 17 : width < 1024 ? 21 : 29"
            centered-slides-bounds
            :grab-cursor="true"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            direction="vertical"
            :modules="[Mousewheel, Autoplay, Scrollbar]"
            :scrollbar="{
              hide: true,
            }"
            :mousewheel="true"
            class="h-full"
          >
            <swiper-slide
              v-for="(nft, i) in stakedNfts"
              :key="`staked-${i}`"
              class="flex gap-1 sm:gap-2 justify-center items-center !h-auto"
            >
              <div class="w-15 sm:w-18 lg:w-20 bg-white shadow-md shadow-gray-400 relative rounded-lg">
                <div class="swiper-lazy-preloader" />
                <img
                  class="relative border border-white swiper-lazy z-20 rounded-lg"
                  :src="'https://cloudflare-ipfs.com/ipfs/' + nft.image.slice(7)"
                  alt="Phunky Fungi"
                >
                <p class="w-full absolute text-center bottom-[-2px] font-bold z-21 text-sm">#{{nft.tokenID}}</p>
              </div>
              <stake-toggle-button @click="onUnstakeCheck(i)" :value="unstakeItems.includes(i)" color="#28c074" class="rounded-full w-6 h-6 sm:w-8 sm:h-8 sm:text-xl">
                ✓
              </stake-toggle-button>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-center gap-y-5 gap-x-16 text-2xl mt-5 px-5 mb-5 sm:mb-0">
        <button class="rounded-full py-3 w-full sm:w-64 font-extrabold shadow-lg shadow-gray-400 bg-gradient-22 hover:bg-gradient-2" @click="onStake()">Stake {{stakeItems.length ? '(' + stakeItems.length + ')' : ''}}</button>
        <button class="rounded-full py-3 w-full sm:w-64 font-extrabold shadow-lg shadow-gray-400 bg-gradient-48 hover:bg-gradient-6" @click="onUnstake()">Unstake {{unstakeItems.length ? '(' + unstakeItems.length + ')' : ''}}</button>
      </div>
    </div>
    <!-- <button v-for="i in 60" :key="`btn-${i}`" :class="`rounded-full py-3 my-3 mx-5 w-64 text-2xl font-extrabold shadow-lg shadow-gray-500 bg-gradient-${i}`">Stake</button> -->
  </section>
  <div
    :class="`fixed top-0 flex justify-center items-center bg-black bg-opacity-70 w-full h-full z-1000 ${wallet.stakingStatus !== '' ? '' : 'hidden'}`"
  >
    <p class="text-2xl">{{ wallet.stakingStatus }}</p>
  </div>
</template>
<style>
.swiper-scrollbar {
  background-color: rgb(255, 255, 255, .2);
}
.swiper-scrollbar-drag {
  background-color: rgb(255, 255, 255, .3);
}
</style>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { Autoplay, Mousewheel, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useWallet } from '@/use/useWallet'
// import Loading from 'vue3-loading-overlay'
// import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

import 'swiper.css'
import 'scrollbar.css'

const { width } = typeof window === 'undefined'
  ? { width: ref(0) }
  : useWindowSize()

const { height } = typeof window === 'undefined'
  ? { height: ref(0) }
  : useWindowSize()

const { wallet, nfts, stakedNfts, totalStaked, karmaAmount, stake, unstake } = useWallet()

const stakeItems = ref<Array<number>>([])
const unstakeItems = ref<Array<number>>([])
const onStakeCheck = (id: number) => {
  const index = stakeItems.value.indexOf(id)
  if (index !== -1) stakeItems.value.splice(index, 1)
  else stakeItems.value.push(id)
}

const onUnstakeCheck = (id: number) => {
  const index = unstakeItems.value.indexOf(id)
  if (index !== -1) unstakeItems.value.splice(index, 1)
  else unstakeItems.value.push(id)
}

const onStake = async () => {
  const itemsToBeStaked = nfts.value.filter((item, index) => stakeItems.value.indexOf(index) > -1)
  await stake(itemsToBeStaked)
  clear()
}

const onUnstake = async () => {
  const itemsToBeUnstaked = stakedNfts.value.filter((item, index) => unstakeItems.value.indexOf(index) > -1)
  await unstake(itemsToBeUnstaked)
  clear()
}

const clear = () => {
  stakeItems.value = []
  unstakeItems.value = []
}

</script>

<route>
{
  "name": "Stake"
}
</route>
