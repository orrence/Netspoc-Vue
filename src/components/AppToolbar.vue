<template>
<v-toolbar v-if="loggedIn" app>

  <router-link to="/services">
    <v-btn flat>
      <span>Dienste</span>
    </v-btn>
  </router-link>
    
  <router-link to="/networks">
    <v-btn flat>
      <span>Netze</span>
    </v-btn>
  </router-link>

  <router-link to="/diff">
    <v-btn flat>
      <span>Diff</span>
    </v-btn>
  </router-link>

  <router-link to="/entitlements">
    <v-btn flat>
      <span>Berechtigungen</span>
    </v-btn>
  </router-link>

  <v-spacer></v-spacer>

  <div>Policy</div>
  <combo-policy></combo-policy>
  <v-spacer/>
  <div>Owner</div>
  <combo-owner></combo-owner>

  <v-btn @click="logout">logout</v-btn>
</v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
import comboPolicy from './ComboPolicy'
import comboOwner from './ComboOwner'
export default {
  components: {
    comboPolicy,
    comboOwner
  },
  name: 'app-toolbar',
  mounted () {
    this.$store.dispatch('setLoggedIn');
  },
  computed: {
    ...mapGetters ([
      'loggedIn'
    ])
  },
  methods: {
    logout () {
      var vm = this;  // get vue instance

      vm.axios.get('/logout'
      ).then(function (response) {
        vm.networks = response.data.records;
      }).catch(function (error) {
        alert('get_networks: ' + error);
      });
      vm.$store.dispatch('setLoggedIn');
      vm.$router.push('/login');
    }
  }
}
</script>