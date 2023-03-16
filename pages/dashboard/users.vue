<template>
  <div class="overflow-hidden">
    <div class="px-4 my-4 max-w-full">
      <h2 class="font-semibold text-xl mb-4">Todos los usuarios</h2>
      <div class="flex justify-between w-full">
        <SelectInput :options="filterOptions" class="w-48"></SelectInput>
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
              <span class="">{{ user.role }}</span>
            </td>
            <td class="p-4 text-sm">
              <span class="">{{ user.branch_office.name }}</span>
            </td>
            <td class="p-4 text-sm">
              <div class="flex items-center justify-center md:justify-start">
                <div
                  class="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"
                  v-if="user.active"
                ></div>
                <div
                  class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"
                  v-else
                ></div>
                <span class="hidden md:inline-block">
                  {{ user.active ? 'Activo' : 'Desactivo' }}
                </span>
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center">
                <Button size="sm" variant="primary" class="mr-3">
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
  </div>
</template>

<script>
import ModalAddUser from '~/components/blocks/Modals/ModalAddUser.vue'

const users = [
  {
    name: 'James Bons',
    nickname: 'jamesbob',
    role: 'ROLE_WAITER',
    branch_office: { name: 'El Zulia' },
    active: true,
  },
  {
    name: 'Bob',
    nickname: 'bob',
    role: 'ROLE_LEADER',
    branch_office: { name: 'El Zulia' },
    active: false,
  },
  {
    name: 'Ana',
    nickname: 'ana',
    role: 'ROLE_OVEN_COOK',
    branch_office: { name: 'El Zulia' },
    active: true,
  },
  {
    name: 'Peter',
    nickname: 'peter12',
    role: 'ROLE_KITCHEN_COOK',
    branch_office: { name: 'El Zulia' },
    active: true,
  },
  {
    name: 'Cristian Mauricio Amaya Mendez',
    nickname: 'cristinamaya',
    role: 'ROLE_OVEN_COOK',
    branch_office: { name: 'El Zulia' },
    active: true,
  },
]

export default {
  layout: 'dashboard',
  data() {
    return {
      users,
      filterOptions: [
        { name: 'Todos los usuarios', selected: true, value: 0 },
        { name: 'El Zulia', value: 1 },
        { name: 'Los Patios', value: 2 },
      ],
    }
  },
  mounted() {
    const roles = [
      { path: 'ROLE_ADMIN', name: 'Administrador' },
      { path: 'ROLE_WAITER', name: 'Mesero' },
      { path: 'ROLE_LEADER', name: 'Líder' },
      { path: 'ROLE_KITCHEN_COOK', name: 'Cocinero de cocina' },
      { path: 'ROLE_OVEN_COOK', name: 'Cocinero de horno' },
    ]
    this.users.forEach((user) => {
      const indexRole = roles.findIndex((role) => role.path === user.role)

      if (indexRole > -1) {
        user.role = roles[indexRole].name
      }
    })
  },
  components: {
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    ModalAddUser,
  },
  methods: {
    openModalAddUser() {
      this.$refs['modal-add-user'].open()
    },
  },
}
</script>
