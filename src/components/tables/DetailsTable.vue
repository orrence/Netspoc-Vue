<template>
<div>
  <v-layout wrap>
      <v-checkbox class="mx-1" height="0px" label="User expandieren" v-model="exus"></v-checkbox>
      <v-checkbox class="mx-1" height="0px" label="Namen statt IPs" v-model="ipas"></v-checkbox>
      <v-checkbox class="mx-1" height="0px" label="Filtern nach Suche" v-model="fise" disabled></v-checkbox>
    </v-layout>
    <v-layout column wrap>
      <v-btn v-on:click="toggleDetails()">Details anzeigen</v-btn>
    </v-layout>
    <v-container v-if="showDetails" fluid grid-list-xl>
      <v-layout row justify-space-between>
        <p>name:</p>
        <p>{{ selection.name }}</p>
      </v-layout>

      <v-layout row justify-space-between>
        <p>description:</p>
        <p>{{ selection.description }}</p>
      </v-layout>

      <v-layout row justify-space-between>
        <p>owner:</p>
        <v-flex xs1>
          
        <v-layout column wrap>
          <v-list
          v-for="item in selection.owner"
          :key="item.name"
        >
          {{item.name}}
        </v-list>
        </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  <Tabulator :title="title" :config="config">
    
  </Tabulator>
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
    exus: false,
    ipas: false,
    fise: true,
    showDetails: false,
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
    },
    exus: function () {
      this.getRules();
      // this.getAdmins();
      // this.getUsers();
    },
    ipas: function () {
      this.getRules();
      this.dark = !this.dark;
      // this.getAdmins();
      // this.getUsers();
    },
    fise: function () {
      this.getRules();
      // this.getAdmins();
      // this.getUsers();
    }
  },
  mounted () {
    this.getRules();
  },
  methods: {
    toggleDetails () {
      this.showDetails = !this.showDetails;
    },
    getRules () {
      var vm = this;	// get vue instance
      vm.axios.get('/get_rules', {
        params: {
          expand_users: vm.exus ? 1 : 0,
          display_property: vm.ipas ? 'name' : 'ip',
          filter_rules: vm.fise ? 1 : 0,
          active_owner: vm.active.owner,
          history: vm.active.policy.date,
          chosen_networks: '',
          service: this.selection.name
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
