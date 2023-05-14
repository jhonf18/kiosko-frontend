<template>
  <div class="bg-primary-light py-14">
    <h2 class="text-3xl font-bold text-white text-center mb-8">
      ¡Selecciona un plato!
    </h2>
    <div class="grid grid-cols-3 gap-8">
      <div
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory(category)"
        class="flex justify-center w-full"
      >
        <div class="max-w-xs relative rounded-3xl overflow-hidden">
          <div
            class="absolute top-0 left-0 bg-gray-800/30 w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <h3 class="text-xl font-bold text-white text-center py-4">
              {{ category.name }}
            </h3>
          </div>
          <img
            :src="category.image"
            class="aspect-video"
            :alt="`Imagen de la categoría ${category.name}`"
            :title="`Imagen de la categoría ${category.name}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const categories = [
  { id: '11', name: 'COCINA', image: require('~/static/images/cocina.png') },
  { id: '12', name: 'HORNO', image: require('~/static/images/horno.png') },
  { id: '13', name: 'BEBIDAS', image: require('~/static/images/bebidas.png') },
]
export default {
  name: 'CategoriesBanner',
  data() {
    return {
      categories,
    }
  },
  methods: {
    selectedCategory(category) {
      this.$emit('selected', category.name)
    },
  },
}
</script>
