<template>
  <Modal
    :id="`modal-${nameRef}-${id}`"
    :ref="`modal-${nameRef}-${id}`"
    title="Editar sucursal"
    size="lg"
    :footer="false"
  >
    <h5 class="mb-2 font-medium">Datos básicos</h5>
    <div class="grid lg:grid-cols-2 gap-4 mb-4">
      <Input
        v-model="branchOffice.name"
        id-input="input-branch-office-name"
        type="text"
        placeholder="Sucursal ...."
        label="Nombre"
      ></Input>
      <Input
        v-model="branchOffice.address"
        id-input="input-branch-office-address"
        type="text"
        placeholder="El Zulia ...."
        label="Dirección"
      ></Input>
    </div>
    <div>
      <template
        v-if="branchOffice.employees && branchOffice.employees.length > 0"
      >
        <h5 class="font-medium mt-4">Empleados actuales en la sucursal</h5>
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
                v-for="employee in branchOffice.employees"
                class="border-b bg-white hover:bg-gray-100"
              >
                <th scope="col" class="text-center text-sm p-3">
                  <input
                    class="w-4 h-4 text-primary-light rounded form-checkbox focus:ring-primary-light cursor-pointer"
                    type="checkbox"
                    :value="employee.id"
                    v-model="branchOffice.selectedEmployees"
                  />
                </th>
                <td class="flex flex-col p-3">
                  <span class="font-semibold text-sm md:text-base">
                    {{ employee.name }}
                  </span>
                  <span class="text-gray-700 text-xs md:text-sm">
                    {{ employee.nickname }}
                  </span>
                </td>
                <td class="p-3 text-sm">
                  <span class="">{{ employee.role | roleName }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <h5 class="font-medium mb-2 text-center mt-6">
          No hay empleados en esta sucursal
        </h5>
      </template>
    </div>
    <div>
      <h5 class="font-medium mb-2 mt-4">Agregar empleados</h5>
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
        :loading="loading"
        :text="button.text"
        @click="editBranchOffice"
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
const nameRef = 'edit-branch-office'

export default {
  name: 'ModalEditBranchOffice',
  props: {
    id: {
      type: String,
      required: true,
    },
    branchOfficeStore: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        name: '',
        address: '',
        employees: [],
        selectedEmployees: [],
      }),
    },
  },
  data() {
    return {
      users: [],
      loading: false,
      branchOffice: {
        id: '',
        name: '',
        address: '',
        employees: [{ rol: '' }],
        selectedEmployees: [],
      },
      button: {
        text: 'Editar sucursal',
      },
      toast: {
        type: 'error',
        message: '',
        visibleTime: 3,
      },
      nameRef,
    }
  },
  computed: {
    ...mapGetters({
      usersStore: userStoreNames.getters.get,
    }),
  },
  async created() {
    if (!this.usersStore) {
      await this.loadUsers()
    }
  },
  methods: {
    ...mapActions({
      loadUsers: userStoreNames.actions.load,
    }),
    ...mapMutations({
      addBranchOffice: branchOfficeStoreNames.mutations.add,
      updateBranchOffice: branchOfficeStoreNames.mutations.update,
      updateUsers: userStoreNames.mutations.updatePropertyBranchOffice,
    }),
    async editBranchOffice() {
      if (this.loading) return

      const fields = ['name', 'address']
      const validation = isNotEmpty(this.branchOffice, fields)

      if (validation.error) {
        this.toast.message = 'Debes ingresar el nombre y la dirección.'
        return this.$refs[`toast-${this.nameRef}`].show()
      }

      try {
        this.isLoading(true)
        const branchOffice = await this.$branchOfficeRepository.update(
          this.branchOffice.id,
          {
            name: this.branchOffice.name,
            address: this.branchOffice.address,
            employees: this.branchOffice.selectedEmployees,
          }
        )

        this.updateBranchOffice(branchOffice)
        this.updateUsers({
          usersIDS: this.branchOffice.selectedEmployees,
          branchOffice: { id: branchOffice.id, name: branchOffice.name },
        })

        this.$refs[`modal-${this.nameRef}-${this.id}`].closeByButton()
        this.isLoading(false)
      } catch (err) {
        const messages = err.message
        this.toast.message = formatErrorMessages(messages)
        return this.$refs[`toast-${this.nameRef}`].show()
      }
    },
    async open() {
      if (!this.usersStore) {
        await this.loadUsers()
      }
      this.users = this.usersStore.filter((user) => {
        return user.role !== 'ROLE_ADMIN' && !user.branch_office
      })

      this.$refs[`modal-${this.nameRef}-${this.id}`].open()
    },
    isLoading(state) {
      if (!state) this.button.text = 'Editar sucursal'
      else this.button.text = 'Editando ...'
      this.loading = state
    },
  },
  watch: {
    branchOfficeStore: {
      handler() {
        this.branchOffice = { ...this.branchOfficeStore }
        const employees = this.usersStore.filter((user) => {
          if (user.branch_office) {
            return user.branch_office.id === this.branchOfficeStore.id
          } else return false
        })
        this.branchOffice.employees = employees
        this.branchOffice.selectedEmployees = []
        this.branchOffice.selectedEmployees =
          this.branchOfficeStore.employees.map((e) => e.id)
      },
      inmmediate: true,
    },
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
