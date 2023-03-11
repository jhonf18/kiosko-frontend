<template>
  <main>
    <Order :products="products"></Order>
  </main>
</template>

<script>
export default {
  name: 'TakeOrderPage',
  data() {
    return {
      products: []
    };
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        '/back-office/products-managment/products?get=id,name,price,variants,variants.name,variants.id'
      );
      console.log(data);
      this.products = data.data;
    } catch (err) {
      console.log(err);
    }
  }
};
</script>
