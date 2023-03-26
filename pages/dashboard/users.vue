<template>
  <div class="overflow-hidden">
    <div class="px-4 my-4 max-w-full">
      <h2 class="font-semibold text-xl mb-4">Todos los usuarios</h2>
      <div class="flex justify-end w-full">
        <Button size="sm" variant="primary" @click="openModalAddUser">
          <span class="flex items-center w-full">
            <PlusIcon></PlusIcon>
            Agregar usuario
          </span>
        </Button>
      </div>
    </div>
    <div class="relative overflow-x-auto w-full max-w-full">
      <table class="w-full">
        <thead>
          <tr class="border-b border-t bg-gray-100">
            <th
              scope="col"
              class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-72 min-w-[200px]"
            >
              Nombre
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm w-48 p-4"
            >
              Posición
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm w-32 p-4"
            >
              Sucursal
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Estado
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" class="border-b bg-white hover:bg-gray-100">
            <td class="flex flex-col p-4">
              <span class="font-semibold text-sm md:text-base">
                {{ user.name }}
              </span>
              <span class="text-gray-700 text-xs md:text-sm">
                {{ user.nickname }}
              </span>
            </td>
            <td class="p-4 text-sm">
              <span class="">{{ user.role | roleName }}</span>
            </td>
            <td class="p-4 text-sm">
              <span v-if="user.branch_office">{{
                user.branch_office.name
              }}</span>
              <span v-else>No asignada</span>
            </td>
            <td class="p-4 text-sm">
              <div class="flex items-center justify-center md:justify-start">
                <div
                  class="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"
                  :class="user.active ? 'bg-green-500' : 'bg-red-500'"
                ></div>
                <span class="hidden md:inline-block">
                  {{ user.active ? 'Activo' : 'Inhabilitado' }}
                </span>
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center">
                <Button
                  size="sm"
                  variant="primary"
                  class="mr-3"
                  @click="openModalEditUser(user)"
                >
                  <span class="flex w-full items-center">
                    <EditIcon class="w-4 h-4 lg:w-5 lg:h-5"></EditIcon>
                    <span class="hidden lg:block">
                      Editar
                      <span class="hidden xl:inline-block">usuario</span>
                    </span>
                  </span>
                </Button>
                <Button size="sm" variant="danger">
                  <span class="flex w-full items-center">
                    <TrashIcon class="w-4 h-4 lg:w-5 lg:h-5"></TrashIcon>
                    <span class="hidden lg:block">Eliminar</span>
                  </span>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalAddUser id="modal-add-user" ref="modal-add-user"></ModalAddUser>
    <ModalEditUser
      id="modal-edit-user"
      ref="modal-edit-user"
      :userStore="userStore"
    ></ModalEditUser>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ModalAddUser from '~/components/blocks/Modals/ModalAddUser.vue'
import ModalEditUser from '~/components/blocks/Modals/ModalEditUser.vue'
import { userStoreNames } from '~/store/user'

export default {
  layout: 'dashboard',
  async created() {
    if (!this.users) {
      await this.loadUsers()
    }
  },
  data() {
    return {
      userStore: {},
    }
  },
  components: {
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    ModalAddUser,
    ModalEditUser,
  },
  methods: {
    openModalAddUser() {
      this.$refs['modal-add-user'].open()
    },
    ...mapActions({
      loadUsers: userStoreNames.actions.load,
    }),
    async openModalEditUser(user) {
      this.userStore = user
      await this.$refs['modal-edit-user'].open()
    },
  },
  computed: {
    ...mapGetters({
      users: userStoreNames.getters.get,
    }),
  },
}
</script>
