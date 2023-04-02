<template>
  <main
    class="min-h-screen w-full flex items-center justify-center transition-colors duration-200"
  >
    <LoginForm></LoginForm>
  </main>
</template>

<script>
import LoginForm from '~/components/blocks/LoginForm.vue'

export default {
  name: 'LoginPage',
  middleware: ['authLogin'],
  components: {
    LoginForm,
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
