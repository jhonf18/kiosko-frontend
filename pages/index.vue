<template>
  <main>
    <input type="text" v-model="nickname" placeholder="nickname" /> <br />
    <input type="password" v-model="password" placeholder="password" /> <br />
    <input type="button" @click="signinUser" value="Iniciar sesión" />
    {{ $auth.user }}
  </main>
</template>

<script>
export default {
  data() {
    return {
      nickname: '',
      password: '',
    }
  },
  methods: {
    async signinUser() {
      console.log('Signin user')
      try {
        const result = await this.$auth.loginWith('local', {
          data: { nickname: this.nickname, password: this.password },
        })
        console.log(this.$user)
        console.log(
          '🚀 ~ file: index.vue:21 ~ signinUser ~ result:',
          JSON.stringify(result)
        )
      } catch (err) {
        console.log(
          '🚀 ~ file: index.vue:25 ~ signinUser ~ err:',
          err.response.data.error
        )
        console.log(
          '🚀 ~ file: index.vue:22 ~ signinUser ~ err:',
          JSON.stringify(err)
        )
      }
    },
  },
}
</script>
