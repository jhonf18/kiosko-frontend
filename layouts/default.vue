<template>
  <div
    class="relative default__layout transition-colors duration-100"
    :class="
      !showAnimationScreen
        ? 'bg-white'
        : 'min-h-screen w-full bg-primary flex items-center justify-center'
    "
  >
    <Transition name="bounce">
      <Logotype v-if="showLogotype"></Logotype>
    </Transition>
    <Nuxt v-if="!showLogotype && !showAnimationScreen"></Nuxt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLogotype: false,
      showAnimationScreen: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.showLogotype = true
    }, 50)
    setTimeout(() => {
      this.showLogotype = false
    }, 1100)
    setTimeout(() => {
      this.showAnimationScreen = false
    }, 1700)
  },
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
