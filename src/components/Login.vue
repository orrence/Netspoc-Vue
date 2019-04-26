<template>
  <v-form @submit="submit">
    <h1>Login</h1>
    <v-btn v-if="!valid"
      color="warning"
    >
    e-mail or password incorrect
    </v-btn>
    <v-btn v-else-if="!email || !password"
      color="warning"
    >
      login credentials needed
    </v-btn>
      
    <v-text-field
      v-model="email"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      class="password"
      required
    ></v-text-field>

    <v-btn type="submit">Submit</v-btn>
    <!-- <v-btn @click="clear">Clear</v-btn> -->
  </v-form>
</template>

<script>
export default {
  name: 'app-login',
  data: () => ({
    email: null,
    password: null,
    valid: true
  }),
  methods: {
    submit () {
      var vm = this;
      if (vm.email) {
        if (vm.password) {
          vm.axios.post(`/login?email=${vm.email}&pass=${vm.email}&app=foo`, 
            { 
              crossdomain: true, 
              maxRedirects: 5 
            })
            .then(function (response) {
              vm.valid = /Unknown\spath/.test(response.data);
              vm.clear();
              if (vm.valid) vm.$router.push('/networks');
            })
            .catch(function (error) {
              alert('login: ' + error);
              vm.valid = false;
            });
        } else {
          vm.axios.post(`/login?email=${vm.email}&app=foo`, 
            { 
              crossdomain: true, 
              maxRedirects: 5 
            })
            .then(function (response) {
              vm.valid = /Unknown\spath/.test(response.data);
              vm.clear();
              if (vm.valid) vm.$router.push('/networks');
            }).catch(function (error) {
              alert('login: ' + error);
              vm.valid = false;
            });
        }
      }
      else {
        vm.valid = false;
      }
      this.$store.dispatch('setLoggedIn');
    },
    clear () {
      this.password = null;
    }
  }
}
</script>
