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
    <BranchOfficeManagmentTable
      :branchOffices="branchOffices"
    ></BranchOfficeManagmentTable>
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
import BranchOfficeManagmentTable from '@/components/blocks/Tables/BranchOfficeManagmentTable.vue'

import { mapActions, mapGetters } from 'vuex'
import { branchOfficeStoreNames } from '~/store/branchOffice'

export default {
  layout: 'dashboard',
  async created() {
    if (!this.branchOffices) {
      await this.loadBranchOffices()
    }
  },
  components: {
    PlusIcon: () => import('@/static/icons/plus.svg?inline'),
    ModalAddBranchOffice,
    BranchOfficeManagmentTable,
  },
  methods: {
    openModalAddBranchOffice() {
      this.$refs['modal-add-branch-office'].open()
    },
    ...mapActions({
      loadBranchOffices: branchOfficeStoreNames.actions.load,
    }),
  },
  computed: {
    ...mapGetters({
      branchOffices: branchOfficeStoreNames.getters.getBranchOffices,
    }),
  },
}
</script>
