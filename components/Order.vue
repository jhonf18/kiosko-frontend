<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <ul>
        <input
          v-if="!product.variants || product.variants.length === 0"
          type="checkbox"
          :id="product.id"
          :value="{ product_id: product.id, price: product.price }"
          v-model="checkedProducts"
        />
        <label :for="product.id">{{ product.name }}</label>
        <li>{{ product.price }}</li>
        <li v-if="product.variants && product.variants.length > 0">
          <strong>Variantes</strong>
          <ul v-for="variant in product.variants" :key="variant.id">
            <input
              type="checkbox"
              :id="variant.id"
              :value="{ product_id: product.id, variant: variant.id, price: product.price }"
              v-model="checkedProducts"
            />
            <label :for="variant.id">{{ variant.name }}</label>
            <li></li>
          </ul>
        </li>
      </ul>
      <hr />
    </div>
    <strong>Precio total: {{ totalPrice }}</strong>
    <br />
    <span>{{ onError }}</span>
    <button @click="takeOrder">Take order</button>
  </div>
</template>

<script>
export default {
  name: 'OrderCompoent',
  props: {
    products: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      count: 0,
      onError: null,
      checkedProducts: [],
      token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZjc1N2M0Yy0yOWE0LTQ3NmMtYTFmYy0xOGY1YTkzNmExNmIiLCJpZCI6Ijk2MTM2OWVmLWVmOTktNDFjYi1hYWU5LWI4NTJlZDMyZjg2OSIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2NzgyMjA0ODMsImV4cCI6MTY3ODI4NTI4MywiYXVkIjoia2lvc2tvIn0.YvstlmhNJtI7XyVPMooKtQCGvKItHKpX0cIuR4lA1ElPLuj09SoRI9P1fO0JOwyNZ5Lk-inIvnu1I_LTbhXCyA'
    };
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main',
      auth: {
        token:
          'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZjc1N2M0Yy0yOWE0LTQ3NmMtYTFmYy0xOGY1YTkzNmExNmIiLCJpZCI6Ijk2MTM2OWVmLWVmOTktNDFjYi1hYWU5LWI4NTJlZDMyZjg2OSIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2NzgyMjA0ODMsImV4cCI6MTY3ODI4NTI4MywiYXVkIjoia2lvc2tvIn0.YvstlmhNJtI7XyVPMooKtQCGvKItHKpX0cIuR4lA1ElPLuj09SoRI9P1fO0JOwyNZ5Lk-inIvnu1I_LTbhXCyA'
      }
    });

    this.socket.emit('authentication', {
      token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZjc1N2M0Yy0yOWE0LTQ3NmMtYTFmYy0xOGY1YTkzNmExNmIiLCJpZCI6Ijk2MTM2OWVmLWVmOTktNDFjYi1hYWU5LWI4NTJlZDMyZjg2OSIsImlkX2JyYW5jaF9vZmZpY2UiOiJlZjU1MzU4Yi0zOTI2LTQ2YTYtYThhZS01ZDlhOTA3ZjAxY2MiLCJpYXQiOjE2NzgyMjA0ODMsImV4cCI6MTY3ODI4NTI4MywiYXVkIjoia2lvc2tvIn0.YvstlmhNJtI7XyVPMooKtQCGvKItHKpX0cIuR4lA1ElPLuj09SoRI9P1fO0JOwyNZ5Lk-inIvnu1I_LTbhXCyA'
    });

    this.socket.on('authenticated', () => {});

    this.socket.on('unauthorized', err => {
      this.onError = err.message;
    });

    this.socket.on('error-to-create-order', err => {
      console.log(err);
    });
  },
  methods: {
    async takeOrder() {
      const result = await this.$axios.post(
        '/managment-orders/orders/create-order',
        {
          total_price: this.totalPrice,
          products: this.checkedProducts
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );

      console.log(result.data.data[0]);
      const order = result.data.data[0].order;
      const tickets = result.data.data[0].tickets;

      this.socket.emit('create-order', {
        order,
        tickets
      });
    }
  },
  computed: {
    totalPrice() {
      return this.checkedProducts.reduce((partialSum, value) => partialSum + value.price, 0);
    }
  }
};
</script>
