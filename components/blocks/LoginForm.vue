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
        <form class="w-full mt-6" @submit.prevent="signinUser">
          <Input
            v-if="!nicknameIsSaved"
            v-model.trim="nickname"
            id-input="login-nickname"
            type="text"
            required="true"
            placeholder="Ingresa tu nombre de usuario"
            class="mb-4"
            size="lg"
          />
          <Message
            v-if="nicknameIsSaved"
            header="Inicio automático"
            class="mb-4"
          >
            Vas a ingresar con el nombre de usuario
            <span class="font-bold">{{ nickname }}</span
            >. <br />
            <span class="mt-2"
              >Si quieres ingresar con otro nombre de usuario dale click
              <span
                @click="loginWithOtherNickname"
                class="text-blue-600 hover:underline cursor-pointer"
                >aquí</span
              >.</span
            >
          </Message>
          <Input
            v-model.trim="password"
            id-input="login-password"
            type="password"
            required="true"
            placeholder="Ingresa tu contraseña"
            size="lg"
          />
          <div class="mt-5 flex items-center" v-if="!nicknameIsSaved">
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
            type="submit"
            variant="primary"
            size="lg-block"
            class="px-6 mt-8"
            @click="signinUser"
          >
            Iniciar sesión
          </Button>
          <input type="submit" value="Submit" class="hidden" />
        </form>
      </div>
    </Transition>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
import { generalStoreNames } from '~/store/general'

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
      nicknameIsSaved: false,
    }
  },
  mounted() {
    const nickname = localStorage.getItem('dataUserLogin')
    if (nickname) {
      this.nicknameIsSaved = true
      this.nickname = nickname
    }
  },
  methods: {
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
    }),
    async signinUser() {
      try {
        await this.$auth.loginWith('local', {
          data: { nickname: this.nickname, password: this.password },
        })

        if (this.rememberUser) {
          // saving nickname in localstorage
          localStorage.setItem('dataUserLogin', this.nickname)
        }
      } catch (err) {
        const errorMessage = err.response.data.error
          ? err.response.data.error.message
          : 'Ha ocurrido un error inesperado en el servidor.'
        this.showToast({
          text: errorMessage,
        })
      }
    },
    loginWithOtherNickname() {
      this.nicknameIsSaved = false
      this.nickname = ''
      localStorage.removeItem('dataUserLogin')
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
