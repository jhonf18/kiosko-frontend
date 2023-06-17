<template>
  <div
    v-if="showAnimationScreen"
    class="absolute z-50 min-w-screen min-h-screen max-h-screen bg-primary w-full h-full flex items-center justify-center"
  >
    <Transition name="bounce">
      <Logotype v-if="showLogotype"></Logotype>
    </Transition>
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

<style scoped lang="postcss">
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
