<template>
  <section class="max-w-lg w-full">
    <Transition name="slide" mode="out-in">
      <div class="w-full flex flex-wrap px-2" v-if="step === 0">
        <Logotype class="w-full"></Logotype>
        <div class="w-full mt-4">
          <Button
            variant="primary"
            size="lg-block"
            class="mb-3 px-6"
            @click="step = 1"
          >
            <span class="flex justify-between">
              Administrador
              <ArrowRightIcon class="inline-block"></ArrowRightIcon>
            </span>
          </Button>
          <Button
            variant="outline-primary"
            size="lg-block"
            class="px-6"
            @click="step = 1"
          >
            <span class="flex justify-between">
              Atención al cliente
              <ArrowRightIcon class="inline-block"></ArrowRightIcon>
            </span>
          </Button>
        </div>
      </div>
      <div class="w-full" v-if="step === 1">
        <h3 class="text-primary-light font-bold text-2xl">Iniciar sesión</h3>
        <form class="w-full mt-6">
          <Input
            v-model="nickname"
            id-input="login-nickname"
            type="email"
            placeholder="Ingresa tu nombre de usuario"
            class="mb-4"
          />
          <Input
            v-model="password"
            id-input="login-password"
            type="password"
            placeholder="Ingresa tu contraseña"
          />
          <div class="mt-5 flex items-center">
            <input
              class="w-5 h-5 text-primary-light rounded form-checkbox focus:ring-primary-light cursor-pointer"
              type="checkbox"
              value=""
              v-model="rememberUser"
              id="remember"
            />
            <label class="hover:cursor-pointer ml-2" for="remember">
              Recuérdame
            </label>
          </div>
          <Button
            variant="primary"
            size="lg-block"
            class="px-6 mt-8"
            @click="signinUser"
          >
            Iniciar sesión
          </Button>
        </form>
      </div>
    </Transition>
  </section>
</template>

<script>
export default {
  name: 'LoginForm',
  components: {
    ArrowRightIcon: () => import('@/static/icons/arrowRight.svg?inline'),
  },
  data() {
    return {
      step: 0,
      nickname: '',
      password: '',
      rememberUser: false,
    }
  },
  methods: {
    async signinUser() {
      try {
        await this.$auth.loginWith('local', {
          data: { nickname: this.nickname, password: this.password },
        })
      } catch (err) {
        console.log(
          '🚀 ~ file: index.vue:25 ~ signinUser ~ err:',
          err.response.data.error
        )
      }
    },
  },
}
</script>

<style scoped>
.slide-enter {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-slide-enter-active {
  position: absolute;
}

.slide-leave {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s linear;
}
</style>
