<template>
  <div class="accordion">
    <AccordionItem id="1">
      <template v-slot:title>
        <h3 class="font-medium">Más opciones</h3>
      </template>
      <template v-slot:content>
        <h4 class="font-medium mb-2">Secciones de paso</h4>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic ipsam
          incidunt minus molestias cumque animi! Exercitationem aspernatur
          minus, animi accusantium reiciendis natus beatae deleniti illo
          delectus corporis, cumque reprehenderit porro.
        </p>
      </template>
    </AccordionItem>
  </div>
</template>

<script>
import AccordionItem from './AccordionItem.vue'

export default {
  name: 'Accordion',
  components: {
    AccordionItem,
  },
}
</script>
