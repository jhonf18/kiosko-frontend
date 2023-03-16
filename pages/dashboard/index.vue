<template>
  <div>
    <div class="mb-4 px-4 pt-4">
      <h2 class="text-xl font-semibold">Sucursales</h2>
      <div class="flex justify-end w-full">
        <Button size="sm" variant="primary" @click="openModalAddBranchOffice">
          <span class="flex items-center w-full">
            <PlusIcon></PlusIcon>
            Agregar sucursal
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
              class="text-left text-gray-700 font-medium uppercase text-sm p-4 w-6/12 min-w-[250px]"
            >
              Nombre
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm w-28 p-4"
            >
              Empleados
            </th>
            <th
              class="text-left text-gray-700 font-medium uppercase text-sm p-4"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="branchOffice in branchOffices"
            class="border-b bg-white hover:bg-gray-100"
          >
            <td class="flex flex-col p-4">
              <span class="font-semibold text-sm md:text-base">
                {{ branchOffice.name }}
              </span>
              <span class="text-gray-700 text-xs md:text-sm">
                {{ branchOffice.address }}
              </span>
            </td>
            <td class="p-4 text-sm">
              <span class="">{{ branchOffice.employees.length }}</span>
            </td>
            <td class="p-4">
              <div class="flex items-center">
                <Button size="sm" variant="primary" class="mr-3">
                  <span class="flex w-full items-center">
                    <EditIcon class="w-4 h-4 lg:w-5 lg:h-5"></EditIcon>
                    <span class="hidden lg:block">
                      Editar
                      <span class="hidden xl:inline-block">sucursal</span>
                    </span>
                  </span>
                </Button>
                <Button size="sm" variant="danger">
                  <span class="flex w-full items-center">
                    <TrashIcon class="w-4 h-4 lg:w-5 lg:h-5"></TrashIcon>
                    <span class="hidden lg:block">
                      Eliminar
                      <span class="hidden xl:inline-block">sucursal</span>
                    </span>
                  </span>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="divide"></div>
    <div class="mb-4 px-8 pt-4">
      <h2 class="text-xl font-semibold">Pedidos</h2>
    </div>
    <ModalAddBranchOffice
      id="modal-add-branch-office"
      ref="modal-add-branch-office"
    ></ModalAddBranchOffice>
  </div>
</template>

<script>
import ModalAddBranchOffice from '@/components/blocks/Modals/ModalAddBranchOffice.vue'

export default {
  layout: 'dashboard',
  data() {
    return {
      branchOffices: [],
    }
  },
  async asyncData(ctx) {
    const branchOffices = await ctx.app.$branchOfficeRepository.index(
      'address,employees,name,id'
    )
    return {
      branchOffices: branchOffices.data,
    }
  },
  async mounted() {},
  components: {
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    ModalAddBranchOffice,
  },
  methods: {
    openModalAddBranchOffice() {
      this.$refs['modal-add-branch-office'].open()
    },
  },
}
</script>
