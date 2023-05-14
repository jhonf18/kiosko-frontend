<template>
  <Modal
    :id="`component-${nameRef}`"
    :ref="`component-${nameRef}`"
    size="sm"
    :fullModal="true"
    :showHeader="false"
    :footer="false"
  >
    <!-- TODO: Modal for add product to cart -->
  </Modal>
</template>

<script>
export default {
  data() {
    return {
      nameRef: 'modal-add-product-2-cart',
    }
  },
  methods: {
    async open() {
      this.$refs[`component-${this.nameRef}`].open()
    },
    close() {
      this.$refs[`component-${this.nameRef}`].closeByButton()
    },
  },
}
</script>
