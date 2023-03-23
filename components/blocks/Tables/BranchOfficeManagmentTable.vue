<template>
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
          <th class="text-left text-gray-700 font-medium uppercase text-sm p-4">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody v-if="branchOffices">
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
          <td class="p-4 text-sm text-center">
            <span class="">{{ branchOffice.employees.length }}</span>
          </td>
          <td class="p-4">
            <div class="flex items-center">
              <Button
                size="sm"
                variant="primary"
                class="mr-3"
                @click="openEditModal(branchOffice)"
              >
                <span class="flex w-full items-center">
                  <EditIcon class="w-4 h-4 lg:w-5 lg:h-5"></EditIcon>
                  <span class="hidden lg:block">
                    Editar
                    <span class="hidden xl:inline-block">sucursal</span>
                  </span>
                </span>
              </Button>
              <Button
                size="sm"
                variant="danger"
                @click="openDeleteModal(branchOffice)"
              >
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
    <ModalEditBranchOffice
      id="modal-edit-branch-office"
      ref="modal-edit-branch-office"
      :branchOfficeStore="branchOfficeForEdit"
    ></ModalEditBranchOffice>
    <ModalDeleteBranchOffice
      id="modal-delete-branch-office"
      ref="modal-delete-branch-office"
      :branchOffice="branchOfficeForEdit"
    ></ModalDeleteBranchOffice>
  </div>
</template>

<script>
import ModalDeleteBranchOffice from '@/components/blocks/Modals/ModalDeleteBranchOffice.vue'
import ModalEditBranchOffice from '@/components/blocks/Modals/ModalEditBranchOffice.vue'

export default {
  name: 'BranchOfficeManagmentTable',
  props: {
    branchOffices: {
      type: Array | null,
      required: true,
    },
  },
  data() {
    return {
      branchOfficeForEdit: {
        id: '',
        name: '',
        address: '',
        employees: [],
      },
    }
  },
  components: {
    EditIcon: () => import('@/static/icons/edit.svg?inline'),
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    ModalEditBranchOffice,
    ModalDeleteBranchOffice,
  },
  methods: {
    openEditModal(branchOffice) {
      this.branchOfficeForEdit = branchOffice
      this.$refs['modal-edit-branch-office'].open()
    },
    openDeleteModal(branchOffice) {
      this.branchOfficeForEdit = branchOffice
      this.$refs['modal-delete-branch-office'].open()
    },
  },
}
</script>
