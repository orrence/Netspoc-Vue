<template>
<v-app-bar
app
v-if="loggedIn"
elevate-on-scroll
>
  
  <v-tabs
  slider-color="orange"
  > 
    <v-tab
    id="rl_services" 
    to="/services/0"
    > Dienste
    </v-tab>
    
    <v-tab
    id="rl_networks"
    to="/networks"
    > Netze
    </v-tab>
  
    <v-tab
    id="rl_diff"
    to="/diff"
    > Diff
    </v-tab>
   </v-tabs>
 
  <v-spacer/>

  <combo-policy id="comb_policy"/>
  <combo-owner id="comb_owner" class="mx-2"/>

  <v-btn id="btn_logout" @click="logout">logout</v-btn>
</v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import comboPolicy from './combos/Policy'
import comboOwner from './combos/Owner'
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
        alert('logout: ' + error);
      });
      vm.$store.dispatch('setLoggedIn');
      vm.$router.push('/login');
    }
  }
}
</script>

<style>
  a { text-decoration: none; }
</style>