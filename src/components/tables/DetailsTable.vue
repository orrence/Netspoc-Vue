<template>
<div>
  <Tabulator :title="title" :config="config"></Tabulator>
</div>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './Tabulator';
export default {
  components: {
    Tabulator,
  },
  props:['selection', 'title'],
  data: () => ({
    config : {
      columns: [
        { title: 'Aktion', field: 'action' },
        { title: 'Quelle', field: 'src', sorter: 'ip'},
        { title: 'Ziel', field: 'dst', sorter: 'ip' },
        { title: 'Protokoll', field: 'prt' },
      ],
      data: [],
      layoutColumnsOnNewData:true,
    },
  }),
  computed: mapState(['active']),
  watch: {
    selection: function () {
      this.getRules();
      // this.getAdmins();
      // this.getUsers();
    }
  },
  mounted () {
    this.getRules();
  },
  methods: {
    getRules: function () {
      var vm = this;	// get vue instance
      vm.axios.get('/get_rules', {
        params: {
          expand_users: 1,
          display_property: 'ip',
          filter_rules: 1,
          active_owner: vm.active.owner,
          history: vm.active.policy.date,
          chosen_networks: '',
          service: this.selection
        }})
        .then(function (response) {
            vm.config.data = response.data.records;
        })
        .catch(function (error) {
            alert('get_hosts: ' + error);
        });
    }
  }
}
</script>

<style>

</style>
