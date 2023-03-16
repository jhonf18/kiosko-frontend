<template>
  <div>
    <label
      v-if="label"
      for="select-input"
      class="block mb-2 text-sm font-medium text-gray-900"
      >{{ label }}</label
    >
    <select
      id="select-input"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      <option
        v-for="option in options"
        :value="option.value"
        :selected="option.selected"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
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
}
</script>
