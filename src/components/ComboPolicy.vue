<template>
<v-flex xs2>
  <v-combobox
    v-model="select"
    :items="policies"
  ></v-combobox>
</v-flex>
</template>

<script>
export default {
  name: 'combo-policy',
  computed: {
    select: {
      get () {
        return null;
      },
      set (newValue) {
        
      }
    },
    policies: {
      get () {
        return [1,2,3];
      }
    }
  },
  mounted () {
    this.$store.dispatch('getOwners');
    this.$store.dispatch('getActiveOwner');
  },
  methods:  {
    getHistory () {
      var vm = this;  // get vue instance

      vm.axios.get('/get_history', {
        params: {
          active_owner: 'x',
          history: ''
        }
      }).then(function (response) {
        this.items = response.data.records;
      }).catch(function (error) {
        //vm.config.data = [];
        alert('get_his: ' + error);
      });
    },
  }
}
</script>