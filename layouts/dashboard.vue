<template>
  <div class="relative default__layout transition-colors duration-100">
    <!-- <AnimationScreen></AnimationScreen> -->
    <nav class="fixed top-0 z-30 w-full bg-white border-b border-gray-200">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              @click="showLateralMenu = !showLateralMenu"
              class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span class="sr-only">Abrir menu</span>
              <MenuIcon></MenuIcon>
            </button>
            <LogotypeNav></LogotypeNav>
          </div>
          <div class="flex items-center ml-3 relative">
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
              >
                {{ $auth.user.name | uppercaseInitials }}
              </span>
            </button>
            <div
              class="z-50 absolute top-8 right-0 my-4 h-auto text-base overflow-hidden list-none transition-all bg-white divide-y divide-gray-100 rounded duration-300 min-w-[200px]"
              :class="
                openDropdown ? 'shadow-sm border max-h-[400px]' : 'max-h-0'
              "
            >
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900" role="none">
                  {{ `${$auth.user.name} (${$auth.user.nickname})` }}
                </p>
                <p
                  class="text-sm font-medium text-gray-900 truncate"
                  role="none"
                >
                  {{ $auth.user.email }}
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <nuxt-link
                    to="/dashboard/settings"
                    class="px-4 py-2 text-sm text-gray-700 flex items-center hover:bg-gray-100"
                    role="menuitem"
                  >
                    <SettingsIcon class="!w-5 !h-5 mr-1"></SettingsIcon>
                    Cambiar contraseña
                  </nuxt-link>
                </li>
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
        </div>
      </div>
    </nav>

    <aside
      id="logo-sidebar"
      class="fixed top-0 left-0 z-20 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0"
      aria-label="Sidebar"
      :class="!showLateralMenu ? '-translate-x-full' : 'translate-x-0'"
    >
      <div class="h-full pb-4 overflow-y-auto bg-white">
        <ul class="space-y-2 px-3">
          <li v-for="(item, index) in navigation" :key="index">
            <nuxt-link
              exact
              :to="item.route"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <component :is="item.componentIcon"></component>
              <span class="ml-3">{{ item.name }}</span>
            </nuxt-link>
          </li>
          <li class="mb-8">
            <a
              href="#"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <StatisticsIcon></StatisticsIcon>
              <span class="flex-1 ml-3 whitespace-nowrap">Estadísticas</span>
              <span
                class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full"
                >Pronto</span
              >
            </a>
          </li>
        </ul>
        <div class="fixed bottom-1 w-full px-3 mt-8">
          <Button
            variant="outline-primary"
            size="block"
            @click="$auth.logout()"
          >
            <span class="flex justify-center items-center">
              Cerrar sesión
              <SignoutIcon></SignoutIcon>
            </span>
          </Button>
        </div>
      </div>
    </aside>

    <main class="pt-18 md:ml-64">
      <div
        class="absolute top-0 left-0 w-full h-full lg:hidden z-10"
        :class="{
          'aside-menu-visible bg-aside-menu min-h-screen': showLateralMenu,
          'aside-menu-invisible': !showLateralMenu,
        }"
        v-if="showLateralMenu"
        @click="showLateralMenu = false"
      ></div>
      <Nuxt></Nuxt>
    </main>
    <Alert></Alert>
    <Toast></Toast>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { userStoreNames } from '~/store/user'

const navigation = [
  {
    name: 'Sucursales',
    componentIcon: 'BranchOfficeIcon',
    route: '/dashboard/',
  },
  { name: 'Usuarios', componentIcon: 'UsersIcon', route: '/dashboard/users' },
  {
    name: 'Productos',
    componentIcon: 'ProductIcon',
    route: '/dashboard/products',
  },
  {
    name: 'Categorias',
    componentIcon: 'CategoryIcon',
    route: '/dashboard/categories',
  },
]
export default {
  data() {
    return {
      navigation,
      showLateralMenu: false,
      openDropdown: false,
    }
  },
  components: {
    UsersIcon: () => import('@/static/icons/users.svg?inline'),
    ProductIcon: () => import('@/static/icons/product.svg?inline'),
    CategoryIcon: () => import('@/static/icons/category.svg?inline'),
    BranchOfficeIcon: () => import('@/static/icons/branchOffice.svg?inline'),
    StatisticsIcon: () => import('@/static/icons/statistics.svg?inline'),
    SignoutIcon: () => import('@/static/icons/signout.svg?inline'),
    MenuIcon: () => import('@/static/icons/menu.svg?inline'),
    SettingsIcon: () => import('@/static/icons/settings.svg?inline'),
  },
  async mounted() {
    await this.loadRoles()
  },
  methods: {
    ...mapActions({
      loadRoles: userStoreNames.actions.loadRoles,
    }),
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

.bg-aside-menu {
  background-color: #262728c4;
}

.aside-menu-visible {
  opacity: 1;
  transition: opacity 1s ease;
  transition-delay: 0.2s;
}

.aside-menu-invisible {
  opacity: 0;
  transition: opacity 0.1s ease;
}

a.nuxt-link-active {
  font-weight: bold;
  @apply bg-primary-light;
}
</style>
