<template>
  <Modal
    :id="`modal-edit-${id}`"
    :ref="`modal-edit-${id}`"
    title="Editar usuario"
    size="lg"
    :footer="false"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <Input
        label="Nombre del empleado"
        v-model="user.name"
        idInput="edit-user-name"
        validations="true"
        required="true"
        typeValidation="name"
        type="text"
        placeholder="Nombre"
        invalidMessage="El nombre ingresado no es válido."
        size="md"
      ></Input>
      <SelectInput
        label="Estado del ususario"
        :options="[
          { name: 'Activo', value: true },
          { name: 'Inhabilitado', value: false },
        ]"
        v-model="user.active"
        class="w-full"
      ></SelectInput>
      <SelectInput
        label="Rol del empleado"
        :options="roles"
        v-model="user.role"
        class="w-full"
      ></SelectInput>
      <SelectInput
        label="Sucursal asignada"
        :options="branchOffices"
        v-model="user.branch_office"
        class="w-full"
      ></SelectInput>
      <Input
        label="Email del empleado"
        v-model.trim="user.email"
        id-input="edit-user-email"
        :disabled="true"
        type="email"
        placeholder="example@kioksollanero.com"
        size="md"
      ></Input>
      <Input
        label="Nombre de usuario del empleado"
        v-model.trim="user.nickname"
        id-input="edit-user-nickname"
        :disabled="true"
        type="text"
        typeValidation="name"
        placeholder="example@kioksollanero.com"
        size="md"
      ></Input>
      <div class="w-full border-t col-span-2">
        <h5 class="font-medium mt-4">Cambiar contraseña</h5>
      </div>
      <Input
        label="Contraseña "
        placeholder="Contraseña"
        v-model.trim="user.password_1"
        :password="user.password_2"
        idInput="edit-user-password-1"
        validations="true"
        type="password"
        typeValidation="password"
        invalidMessage="La contraseña es muy débil."
        size="md"
      ></Input>
      <Input
        label="Repetir contraseña"
        placeholder="Repetir contraseña"
        v-model.trim="user.password_2"
        idInput="edit-user-password-2"
        validations="true"
        :password="user.password_1"
        type="password"
        typeValidation="password"
        invalidMessage="La contraseña es muy débil."
        size="md"
      ></Input>
    </div>
    <div class="flex justify-end mt-8 mb-2">
      <ButtonWithSpinner
        @click="editUser"
        :loading="loading"
        :text="buttonText"
      ></ButtonWithSpinner>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { formatErrorMessages } from '~/assets/utils/formatErrorMessage'
import { branchOfficeStoreNames } from '~/store/branchOffice'
import { generalStoreNames } from '~/store/general'
import { userStoreNames } from '~/store/user'

export default {
  name: 'ModalEditUSer',
  props: {
    id: {
      type: String,
      required: true,
    },
    userStore: {
      type: Object,
      default: () => ({
        id: '',
        active: true,
        name: '',
        email: '',
        branchOffice: { id: '' },
        role: '',
      }),
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
        branch_office_id: -1,
      },
      roles: [],
      branchOffices: [],
      buttonText: 'Actualizar usuario',
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
    userStore(newValue) {
      this.user = {
        ...newValue,
        branch_office: newValue.branch_office
          ? newValue.branch_office.id
          : null,
      }
      this.user.branch_office_id = newValue.branch_office
        ? JSON.parse(JSON.stringify(newValue.branch_office.id))
        : null
    },
  },
  methods: {
    ...mapActions({
      loadBranchOffices: branchOfficeStoreNames.actions.load,
    }),
    ...mapMutations({
      showToast: generalStoreNames.mutations.showToast,
      updateUser: userStoreNames.mutations.update,
      updateEmployee: branchOfficeStoreNames.mutations.updateEmployee,
    }),
    async editUser() {
      if (this.loading) return

      this.setLoading(true)

      if (!this.user.name || this.user.name.length === 0) {
        this.showToast({
          text: 'Es necesario el nombre del usuario.',
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

      let password = null
      if (
        this.user.password_1 &&
        this.user.password_1.length > 0 &&
        this.user.password_2 &&
        this.user.password_2 > 0
      ) {
        if (this.user.password_1 !== this.user.password_2) {
          this.showToast({
            text: 'Las contraseñas son distintas.',
            type: 'error',
          })
          this.setLoading(false)
          return
        }

        password = this.user.password_1
      }

      try {
        const user = await this.$userRepository.update(this.user.id, {
          name: this.user.name,
          active: this.user.active,
          branch_office: this.user.branch_office,
          role: this.user.role,
          password,
        })

        console.log(this.user.branch_office_id)

        this.updateUser(user)
        this.updateEmployee({
          user,
          branchOfficeID: user.branch_office.id,
          oldBranchOfficeID: this.user.branch_office_id,
        })

        this.showToast({
          text: 'Se ha actualizado el usuario satisfactoriamente.',
          type: 'success',
          visibleTime: 2,
        })
      } catch (err) {
        this.showToast({
          text: formatErrorMessages(err.message),
          type: 'error',
          visibleTime: 3,
        })
        return this.setLoading(false)
      }

      setTimeout(() => {
        this.close()
        this.setLoading(false)
      }, 2000)
    },
    setLoading(state) {
      this.buttonText = state ? 'Editando ...' : 'Editar usuario'
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
      this.$refs[`modal-edit-${this.id}`].open()
      await this.loadBranchOffices()
    },
    close() {
      this.$refs[`modal-edit-${this.id}`].closeByButton()
    },
  },
}
</script>
