<template>
  <Modal
    :id="`modal-${nameRef}-${id}`"
    :ref="`modal-${nameRef}-${id}`"
    title="Eliminar sucursal"
    size="lg"
    :footer="false"
  >
    <Message header="Eliminar cuenta" variant="danger" class="mb-4">
      Este es un proceso irreversible, ¿estás seguro de borrar el usuario?
    </Message>
    <h5 class="font-medium mb-3">Datos de la sucursal</h5>
    <ul class="max-w-md space-y-1 list-disc list-inside mb-4 text-sm">
      <li>
        <span class="uppercase font-medium">Nombre: </span>
        {{ branchOffice.name }}
      </li>
      <li>
        <span class="uppercase font-medium">Dirección: </span>
        {{ branchOffice.address }}
      </li>
    </ul>
    <div>
      <h5 class="font-medium mb-2">Empleados</h5>
      <div class="relative overflow-x-auto w-full max-w-full">
        <table class="w-full">
          <thead>
            <tr class="border-b border-t bg-gray-100">
              <th
                scope="col"
                class="text-left text-gray-700 font-medium uppercase text-sm p-3 w-6/12 min-w-[250px]"
              >
                Nombre
              </th>
              <th
                class="text-left text-gray-700 font-medium uppercase text-sm w-28 p-3"
              >
                Posición
              </th>
            </tr>
          </thead>
          <tbody v-if="branchOffice.employees">
            <tr
              v-for="user in branchOffice.employees"
              class="border-b bg-white hover:bg-gray-100"
            >
              <td class="flex flex-col p-3">
                <span class="font-semibold text-sm md:text-base">
                  {{ user.name }}
                </span>
                <span class="text-gray-700 text-xs md:text-sm">
                  {{ user.nickname }}
                </span>
              </td>
              <td class="p-3 text-sm" v-if="user.role">
                <span class="">{{ user.role | roleName }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="openModalConfirmPassword"
        :loading="loading"
        :text="button.text"
        variant="danger"
      ></ButtonWithSpinner>
    </div>
    <Toast
      :ref="`toast-${nameRef}`"
      :type="toast.type"
      :visible-time="toast.visibleTime"
    >
      <p>
        {{ toast.message }}
      </p>
    </Toast>
    <ModalConfirmPassword
      id="branch-office"
      ref="modal-confirm-pwd-brach-office"
      @correctPassword="deleteBranchOffice"
    ></ModalConfirmPassword>
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { generalStoreNames } from '~/store/general'
import { userStoreNames } from '~/store/user'
import ModalConfirmPassword from './ModalConfirmPassword.vue'
const nameRef = 'add-branch-office'

export default {
  name: 'ModalDeleteBranchOffice',
  props: {
    id: {
      type: String,
      required: true,
    },
    branchOffice: {
      type: Object,
      default: (rawProps) => {
        return { name: '', address: '', employees: [] }
      },
      required: true,
    },
  },
  data() {
    return {
      users: [],
      button: {
        text: 'Eliminar sucursal',
      },
      toast: {
        type: 'error',
        message: '',
        visibleTime: 3,
      },
      nameRef,
      loading: false,
    }
  },
  methods: {
    ...mapMutations({
      updateUsers: userStoreNames.mutations.update,
      showToast: generalStoreNames.mutations.showToast,
      deleteBranchOfficeStore: branchOfficeStoreNames.mutations.delete,
    }),
    async deleteBranchOffice() {
      if (this.loading) return

      this.isLoading(true)

      try {
        await this.$branchOfficeRepository.delete(this.branchOffice.id)

        this.deleteBranchOfficeStore(this.branchOffice)
        this.updateUsers({
          usersIDS: [],
          branchOffice: {
            id: this.branchOffice.id,
            name: this.branchOffice.name,
          },
        })

        this.showToast({
          text: 'Se ha eliminado la sucursal satisfactoriamente.',
          type: 'success',
          visibleTime: 2,
        })
      } catch (err) {
        this.showToast({
          text: err.message,
          type: 'error',
          visibleTime: 3,
        })
        this.isLoading(false)
      }

      setTimeout(() => {
        this.close()
      }, 2000)
    },
    openModalConfirmPassword() {
      if (this.loading) return
      this.$refs['modal-confirm-pwd-brach-office'].open()
    },
    isLoading(state) {
      if (state) this.button.text = 'Eliminando ...'
      else this.button.text = 'Eliminar sucursal'
      this.loading = state
    },
    open() {
      this.$refs[`modal-${this.nameRef}-${this.id}`].open()
    },
    close() {
      this.$refs[`modal-${this.nameRef}-${this.id}`].closeByButton()
    },
  },
  components: { ModalConfirmPassword },
}
</script>
