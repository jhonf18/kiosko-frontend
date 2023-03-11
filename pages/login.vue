<template>
  <main
    class="min-h-screen w-full bg-primary flex items-center justify-center transition-colors duration-200"
    :class="step === 1 ? 'bg-white' : 'bg-primary'"
  >
    <Transition name="bounce">
      <Logotype v-if="showLogotype"></Logotype>
    </Transition>
    <LoginForm v-if="step === 1"></LoginForm>
  </main>
</template>

<script>
import LoginForm from '~/components/blocks/LoginForm.vue'

export default {
  name: 'LoginPage',
  components: {
    LoginForm,
  },
  data() {
    return {
      step: 1,
      showLogotype: false,
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.showLogotype = true
    // }, 50)
    // setTimeout(() => {
    //   this.showLogotype = false
    // }, 1100)
    // setTimeout(() => {
    //   this.step = 1
    // }, 1700)
  },
  head() {
    return {
      title: 'Inicia sesión',
    }
  },
}
</script>

<style lang="postcss" scoped>
.title {
  @apply bg-gray-200;
}

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
