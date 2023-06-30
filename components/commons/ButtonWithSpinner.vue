<template>
  <Button :variant="variant" :size="size" @click="$emit('click')">
    <span class="flex" :class="{ 'justify-center': textCenter }">
      <Spinner v-if="loading" :variant="color"></Spinner>
      {{ text }}
    </span>
  </Button>
</template>

<script>
const variants = [
  'default',
  'success',
  'danger',
  'primary',
  'warning',
  'outline',
  'outline-danger',
  'outline-success',
  'outline-primary',
  'outline-warning',
]

export default {
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: false,
      default: 'primary',
      validator: (value) => variants.includes(value),
    },
    size: {
      type: String,
      required: false,
      default: 'md',
    },
    textCenter: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      color: 'primary',
    }
  },
  mounted() {
    if (this.variant === 'danger' || this.variant === 'outline-danger') {
      this.color = 'red'
    } else if (
      this.variant === 'success' ||
      this.variant === 'outline-success'
    ) {
      this.color = 'green'
    }
  },
}
</script>
