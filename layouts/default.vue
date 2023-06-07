<template>
  <div class="relative default__layout transition-colors duration-100">
    <!-- TODO: Add animation screen -->
    <!-- <AnimationScreen></AnimationScreen> -->
    <header
      class="fixed top-0 z-30 w-full bg-white border-b border-gray-200 px-3 py-3 lg:px-5 lg:pl-3"
    >
      <LogotypeNav></LogotypeNav>
    </header>
    <div class="pt-16 md:pt-18">
      <Nuxt></Nuxt>
    </div>
    <Alert></Alert>
    <Toast></Toast>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      socket: null,
    }
  },
}
</script>
