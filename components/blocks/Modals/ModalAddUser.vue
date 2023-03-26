<template>
  <Modal
    :id="`component-${id}`"
    :ref="`component-${id}`"
    target="modal-add-user"
    size="lg"
    :footer="false"
  >
    <div class="grid grid-cols-2 gap-4 mb-4">
      <Input
        label="Ingresa el nombre del empleado"
        v-model="user.name"
        idInput="add-user-name"
        validations="true"
        required="true"
        typeValidation="name"
        type="text"
        placeholder="Nombre"
        invalidMessage="El nombre ingresado no es válido."
        class="mb-4"
        size="md"
      ></Input>
      <Input
        label="Ingresa el email del empleado"
        v-model.trim="user.email"
        id-input="add-user-email"
        type="email"
        required="true"
        validations="true"
        typeValidation="email"
        placeholder="example@kioksollanero.com"
        invalidMessage="Al parecer el correo no es válido."
        class="mb-4"
        size="md"
      ></Input>
      <Input
        label="Contraseña "
        placeholder="Contraseña"
        v-model.trim="user.password_1"
        idInput="add-user-password-1"
        required="true"
        validations="true"
        type="password"
        typeValidation="password"
        invalidMessage="La contraseña es muy débil."
        class="mb-4"
        size="md"
      ></Input>
      <Input
        label="Repetir contraseña"
        placeholder="Repetir contraseña"
        v-model.trim="user.password_2"
        idInput="add-user-password-2"
        required="true"
        validations="true"
        type="password"
        typeValidation="password"
        invalidMessage="La contraseña es muy débil."
        class="mb-4"
        size="md"
      ></Input>
      <SelectInput
        label="Seleccionar el rol del empleado"
        :options="roles"
        v-model="user.role"
        class="w-full"
      ></SelectInput>
      <SelectInput
        label="Seleccionar sucursal"
        :options="branchOffices"
        v-model="user.branch_office"
        class="w-full"
      ></SelectInput>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="createUser"
        :loading="loading"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { isNotEmpty } from '~/assets/js/validations'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { generalStoreNames } from '~/store/general'
import { userStoreNames } from '~/store/user'

export default {
  name: 'ModalAddUser',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password_1: '',
        password_2: '',
        role: null,
        branch_office: null,
      },
      roles: [],
      branchOffices: [],
      buttonText: 'Crear usuario',
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      rolesStore: userStoreNames.getters.getRoles,
      branchOfficesStore: branchOfficeStoreNames.getters.getBranchOffices,
    }),
  },
  mounted() {
    this.setRoles(this.rolesStore)
    this.setBranchOffices(this.branchOfficesStore)
  },
  watch: {
    rolesStore(newValue) {
      this.setRoles(newValue)
    },
    branchOfficesStore(newValue) {
      this.setBranchOffices(newValue)
    },
  },
  methods: {
    ...mapActions({
      loadBranchOffices: branchOfficeStoreNames.actions.load,
    }),
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      addEmployee: branchOfficeStoreNames.mutations.addEmployee,
      addUser: userStoreNames.mutations.add,
    }),
    async createUser() {
      if (this.loading) return

      this.setLoading(true)
      const fields = ['name', 'email', 'password_1', 'password_2']
      const validation = isNotEmpty(this.user, fields)

      if (validation.error) {
        this.showToast({
          text: 'Es necesario introducir el nombre, email y las contraseñas.',
          type: 'error',
        })
        this.setLoading(false)
        return
      }

      if (!this.user.branch_office || !this.user.role) {
        const text = !this.user.branch_office
          ? 'Debes seleccionar una sucursal'
          : 'Debes seleccionar un rol'
        this.showToast({
          text,
          type: 'error',
        })
        this.setLoading(false)
        return
      }

      try {
        const user = await this.$userRepository.create(this.user)

        this.addEmployee({ ...user, branchOfficeID: user.branch_office.id })
        this.addUser(user)

        this.showToast({
          text: 'Se ha creado el usuario satisfactoriamente.',
          type: 'success',
          visibleTime: 2,
        })
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
        this.setLoading(false)
      }

      setTimeout(() => {
        this.close()
        this.setLoading(false)
      }, 2000)
    },
    setLoading(state) {
      if (state) this.buttonText = 'Creando ...'
      else this.buttonText = 'Crear usuario'

      this.loading = state
    },
    setBranchOffices(branchOffices) {
      branchOffices = branchOffices || []
      this.branchOffices = branchOffices.map((branchOffice) => {
        return {
          name: `${branchOffice.name}, ${branchOffice.address}`,
          value: branchOffice.id,
        }
      })

      this.branchOffices.unshift({
        name: 'Sucursales',
        value: null,
        selected: true,
      })
    },
    setRoles(roles) {
      this.roles = [{ name: 'Roles', value: null, selected: true }, ...roles]
    },
    async open() {
      this.$refs[`component-${this.id}`].open()
      await this.loadBranchOffices()
    },
    close() {
      this.$refs[`component-${this.id}`].closeByButton()
    },
  },
}
</script>
