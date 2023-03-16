<template>
  <Modal
    :id="`component-${id}`"
    :ref="`component-${id}`"
    target="modal-add-user"
    title="Agregar un nuevo usuario"
    size="sm"
    @close="onClose"
  >
    Modal User
  </Modal>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    open() {
      this.$refs[`component-${this.id}`].open()
    },
    onClose() {
      console.log('close modal')
    },
  },
}
</script>
