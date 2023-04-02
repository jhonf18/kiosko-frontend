<template>
  <div class="grid md:grid-cols-2 gap-4">
    <SearchWithAutocomplete
      :items="items"
      label="Ingresa las secciones de paso"
      placeholder="Enter para agregar una sección de paso"
      @selectedItem="onSelectedItem"
    ></SearchWithAutocomplete>
    <div class="col-span-full">
      <div class="text-center my-3" v-if="sections.length === 0">
        <span> No has ingresado ninguna sección de paso </span> <br />
        <span class="text-sm"
          >Por defecto se encuentra seleccionada la misma que la de la
          categoría.</span
        >
      </div>
      <div>
        <ul>
          <li
            v-for="section in sections"
            class="flex items-center justify-between px-3 py-3 rounded hover:bg-gray-100"
          >
            <span class="flex items-center">
              <CheckIcon class="w-4 h-4 stroke-primary-dark mr-1"></CheckIcon>
              {{ section }}
            </span>
            <TrashIcon
              @click="deletePassageSection(section)"
              class="!w-5 !h-5 stroke-red-600 cursor-pointer"
            ></TrashIcon>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SearchWithAutocomplete from '../special/SearchWithAutocomplete.vue'

export default {
  name: 'SearchPassingSectionsForm',
  props: {
    passingSections: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SearchWithAutocomplete,
    TrashIcon: () => import('@/static/icons/trash.svg?inline'),
    CheckIcon: () => import('@/static/icons/check.svg?inline'),
  },
  data() {
    return {
      sections: [],
      items: [
        { name: 'HORNO', value: 'HORNO' },
        { name: 'COCINA', value: 'COCINA' },
      ],
    }
  },
  methods: {
    onSelectedItem(item) {
      if (this.sections.includes(item.value)) return

      this.sections.push(item.value)
      this.$emit('updateSelection', this.sections)
    },
    deletePassageSection(section) {
      const index = this.sections.indexOf(section)
      this.sections.splice(index, 1)
      this.$emit('updateSelection', this.sections)
    },
  },
  watch: {
    passingSections: {
      handler: function (val) {
        this.sections = [...val]
      },
      immediate: true,
    },
  },
}
</script>
