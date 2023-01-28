<template>
  <section class="section min-h-screen flex items-center bg-hero bg-normal pt-40 md:pt-48">
    <div class="<xl:text-center <xl:mx-auto max-w-2xl">
      <h1 class="font-davida text-primary text-3xl md:text-4xl xl:text-5xl">
        Welcome to<br class="sm:hidden"> Phunky Fungi
      </h1>
      <p class="md:text-xl mt-6">
        Phunky Fungi is an NFT community that that will lead you on a majestic adventure
        into the metaverse and the adoption of Web 3.0.
        We believe in spreading good vibes, mutual respect, and
        mental health-focused psychadelic research.
        Visit our
        <a
          href="https://discord.gg/qjhKjxBmEm"
          class="font-bold text-tertiary xl:text-secondary"
        >
          Discord
        </a>
        to learn more and join our community! #mushlove
      </p>
      <router-link
        class="btn inline-block btn--primary mt-8"
        :to="{ name: 'About' }"
      >
        About Phunky Fungi
      </router-link>
      <div class="flex items-center <xl:justify-center mt-4">
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
  </section>
</template>
