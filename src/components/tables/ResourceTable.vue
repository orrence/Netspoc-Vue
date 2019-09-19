<template>
<div>
  <Tabulator :config="config"></Tabulator>
</div>
</template>

<script>
import { mapState } from 'vuex';
import Tabulator from './Tabulator';
export default {
  components: {
    Tabulator,
  },
  props:['selection'],
  data: () => ({
    config : {
      columns: [
        { title: 'IP-Addresse', field: 'ip', sorter: 'ip' },
        { title: 'Name', field: 'name' },
        { title: 'Verantwortungsbereich', field: 'owner' },
      ],
      data: [],
      layoutColumnsOnNewData:true,
    },
  }),
  computed: mapState(['active']),
  watch: {
    selection: function () {
      this.getHosts();
    }
  },
  mounted () {
    this.getHosts();
  },
  methods: {
    getHosts: function () {
      var vm = this;	// get vue instance
      vm.axios.get('/get_hosts', {
        params: {
          network: vm.selection,
          active_owner: vm.active.owner,
          history: vm.active.policy.date
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
