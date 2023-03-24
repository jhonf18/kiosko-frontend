<template>
  <Modal
    :id="`modal-${nameRef}-${id}`"
    :ref="`modal-${nameRef}-${id}`"
    title="Agregar una nueva sucursal"
    size="lg"
    :footer="false"
  >
    <h5 class="mb-2 font-medium">Datos básicos</h5>
    <div class="grid lg:grid-cols-2 gap-4 mb-4">
      <Input
        v-model.trim="branchOffice.name"
        id-input="input-branch-office-name"
        type="text"
        placeholder="Sucursal ...."
        label="Nombre"
      ></Input>
      <Input
        v-model.trim="branchOffice.address"
        id-input="input-branch-office-address"
        type="text"
        placeholder="El Zulia ...."
        label="Dirección"
      ></Input>
    </div>
    <div>
      <h5 class="font-medium mb-2">Agregar empleados</h5>
      <div class="relative overflow-x-auto w-full max-w-full">
        <table class="w-full">
          <thead>
            <tr class="border-b border-t bg-gray-100">
              <th scope="col" class="text-center text-sm p-3 w-5">
                <input
                  class="w-4 h-4 text-primary-light rounded form-checkbox focus:ring-primary-light cursor-pointer"
                  type="checkbox"
                  value=""
                />
              </th>
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
          <tbody>
            <tr
              v-for="user in users"
              class="border-b bg-white hover:bg-gray-100"
            >
              <th scope="col" class="text-center text-sm p-3">
                <input
                  class="w-4 h-4 text-primary-light rounded form-checkbox focus:ring-primary-light cursor-pointer"
                  type="checkbox"
                  :value="user.id"
                  v-model="branchOffice.selectedEmployees"
                />
              </th>
              <td class="flex flex-col p-3">
                <span class="font-semibold text-sm md:text-base">
                  {{ user.name }}
                </span>
                <span class="text-gray-700 text-xs md:text-sm">
                  {{ user.nickname }}
                </span>
              </td>
              <td class="p-3 text-sm">
                <span class="">{{ user.role | roleName }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="createBranchOffice"
        :loading="loading"
        :text="button.text"
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
  </Modal>
</template>

<script>
import { isNotEmpty } from '@/assets/js/validations'
import { formatErrorMessages } from '@/assets/utils/formatErrorMessage'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { userStoreNames } from '~/store/user'
const nameRef = 'add-branch-office'

export default {
  name: 'ModalAddBranchOffice',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      branchOffice: {
        name: '',
        address: '',
        selectedEmployees: [],
      },
      users: [],
      button: {
        text: 'Crear sucursal',
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
  computed: {
    ...mapGetters({
      usersStore: userStoreNames.getters.get,
    }),
  },
  methods: {
    ...mapActions({
      loadUsers: userStoreNames.actions.load,
    }),
    ...mapMutations({
      addBranchOffice: branchOfficeStoreNames.mutations.add,
      updateUsers: userStoreNames.mutations.update,
    }),
    async createBranchOffice() {
      if (this.loading) return

      const fields = ['name', 'address']
      const validation = isNotEmpty(this.branchOffice, fields)

      if (validation.error) {
        this.toast.message = 'Debes ingresar el nombre y la dirección.'
        return this.$refs[`toast-${this.nameRef}`].show()
      }

      try {
        const branchOffice = await this.$branchOfficeRepository.create({
          name: this.branchOffice.name,
          address: this.branchOffice.address,
          employees: this.branchOffice.selectedEmployees,
        })

        this.addBranchOffice(branchOffice)
        this.updateUsers({
          usersIDS: this.branchOffice.selectedEmployees,
          branchOffice: { id: branchOffice.id, name: branchOffice.name },
        })

        this.$refs[`modal-${this.nameRef}-${this.id}`].closeByButton()
      } catch (err) {
        const messages = err.message
        this.toast.message = formatErrorMessages(messages)
        return this.$refs[`toast-${this.nameRef}`].show()
      }
    },
    isLoading(state) {
      if (state) this.button.text = 'Creando ...'
      else this.button.text = 'Crear sucursal'

      this.loading = state
    },
    async setUsers() {
      if (!this.usersStore) {
        await this.loadUsers()
      }
      this.users = this.usersStore.filter((user) => {
        return user.role !== 'ROLE_ADMIN' && !user.branch_office
      })
    },
    async open() {
      this.$refs[`modal-${this.nameRef}-${this.id}`].open()
      await this.setUsers()
    },
  },
  watch: {
    usersStore: {
      handler() {
        this.users = this.usersStore.filter((user) => {
          return user.role !== 'ROLE_ADMIN' && !user.branch_office
        })
      },
      inmediate: true,
    },
  },
}
</script>
