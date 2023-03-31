<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="font-medium text-sm mb-1 text-gray-600"
      >{{ label }}</label
    >
    <select
      :id="id"
      @change="onChange"
      v-model="content"
      :disabled="disabled"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none focus:outline-gray-400"
    >
      <option
        v-for="option in options"
        :value="option.value"
        :disabled="!option.value && typeof option.value !== 'boolean'"
        :selected="typeof option.value === 'undefined' || !option.value"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: undefined,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      id: `${new Date().getTime() - Math.random()}`,
      content: this.value,
    }
  },
  methods: {
    onChange() {
      this.$emit('update', this.content)
    },
  },
}
</script>
