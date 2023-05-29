<template>
  <section
    class="flex justify-between items-center rounded-3xl bg-primary-light/20"
  >
    <button
      class="ml w-8 h-8 rounded-full text-white bg-primary-light text-xl"
      aria-hidden="true"
      @click="onChangeValue(valueModel - 1)"
    >
      &minus;
    </button>
    <input
      style="background-color: transparent"
      class="h-8 py-2 w-10 text-center text-lg ml-2"
      type="number"
      name="qty"
      id="qty"
      min="1"
      max="20"
      step="1"
      value="1"
      :value="valueModel"
    />
    <button
      class="mr-0 w-8 h-8 rounded-full text-white bg-primary-light text-xl"
      aria-hidden="true"
      @click="onChangeValue(valueModel + 1)"
    >
      &plus;
    </button>
  </section>
</template>

<script>
export default {
  name: 'InputQuantity',
  model: {
    prop: 'value',
    event: 'update',
  },
  data() {
    return {
      valueModel: 1,
    }
  },
  methods: {
    onChangeValue(value) {
      if (value > 0) {
        this.valueModel = value
        this.$emit('update', value)
      }
    },
  },
}
</script>

<style lang="postcss">
button {
  padding: 0;
  margin: 0;
  border-style: none;
  touch-action: manipulation;
  display: inline-block;
  border: none;
  background: none;
  cursor: pointer;
}
.qty {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
}
.qty label {
  flex: 1 0 100%;
}
.qty input {
}
</style>
