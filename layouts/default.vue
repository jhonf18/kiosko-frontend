<template>
  <div class="relative default__layout transition-colors duration-100">
    <AnimationScreen></AnimationScreen>
    <header
      class="flex items-center justify-between fixed top-0 z-30 w-full bg-white border-b border-gray-200 px-3 py-3 lg:px-5 lg:pl-3"
    >
      <LogotypeNav></LogotypeNav>
      <div class="flex items-center ml-3 relative" v-if="$auth.user">
        <button
          type="button"
          class="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300"
          aria-expanded="false"
          @click="toggleDropdown"
        >
          <span class="sr-only">Abrir menu de usuario</span>
          <span
            ref="dropdown-button-profile"
            class="w-9 h-9 rounded-full flex-none bg-primary-dark flex items-center justify-center font-semibold text-white text-center"
            v-if="$auth.user.name"
          >
            {{ $auth.user.name | uppercaseInitials }}
          </span>
        </button>
        <div
          class="z-50 absolute top-8 right-0 my-4 h-auto text-base overflow-hidden list-none transition-all bg-white divide-y divide-gray-100 rounded duration-300 min-w-[250px]"
          :class="openDropdown ? 'shadow-sm border max-h-[400px]' : 'max-h-0'"
        >
          <div class="px-4 py-3" role="none">
            <p class="text-sm text-gray-900" role="none">
              {{ `${$auth.user.name}` }}
              <span class="text-xs"> ({{ $auth.user.nickname }}) </span>
            </p>
            <p class="text-sm font-medium text-gray-900 truncate" role="none">
              {{ $auth.user.email }}
            </p>
          </div>
          <ul class="py-2" role="none">
            <li>
              <span
                @click="$auth.logout()"
                class="cursor-pointer px-4 py-2 text-sm flex items-center text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <SignoutIcon class="!w-5 !h-5 mr-1"></SignoutIcon>
                Cerrar sesión
              </span>
            </li>
          </ul>
        </div>
      </div>
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
      openDropdown: false,
    }
  },
  components: {
    SignoutIcon: () => import('@/static/icons/signout.svg?inline'),
  },
  methods: {
    toggleDropdown() {
      const closeListerner = (e) => {
        if (this.catchOutsideClick(e, this.$refs['dropdown-button-profile']))
          window.removeEventListener('click', closeListerner),
            (this.openDropdown = false)
      }

      window.addEventListener('click', closeListerner)
      this.openDropdown = !this.openDropdown
    },
    catchOutsideClick(event, dropdown) {
      if (dropdown == event.target) return false
      if (this.openDropdown && dropdown != event.target) return true
    },
  },
}
</script>
