<template>
  <div id="table_services_user">
    <Tabulator
      :tableconfig="{
        reactiveData: true,
        selectable: 1,

        rowSelected: passOnSelectionUpdate,
        //rowSelectionChanged: passOnSelectionUpdate
      }"
      :name="`Dienstbenutzer`"
      :columns="[
        {
          title: 'Name',
          field: 'name',
        },
        {
          title: 'IP-Adressen',
          field: 'ip',
          sorter: 'ip',
        },
        {
          title: 'Verantwortungsbereich',
          field: 'owner',
        },
      ]"
      :data="usersData"
      :groupBy="serviceSelection.length > 1 ? 'service' : ''"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Tabulator from "../Tabulator";
export default {
  components: {
    Tabulator,
  },
  props: ["filterBySearch"],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState("services", ["usersData","searchInput","serviceSelection"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    serviceSelection: function () {
      this.getUsers();
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    ...mapActions("services", ["getServiceUsers"]),
    passOnSelectionUpdate(data) {
  
      const payload = {
        chosen_networks: this.searchInput.search_networks.join(","),
        active_owner: this.getActiveOwner,
        history: this.getActivePolicy,
        owner: data.getData().owner,
      };
      this.$store.dispatch('services/getAdminsData',payload);
    },
    getUsers() {
      var vm = this; // get vue instance

      if(vm.serviceSelection.length !== 1) {
        return;
      }
      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        service: vm.serviceSelection.map((row) => row.name).join(","),
        expand_users: vm.expandUser ? 1 : 0,
        display_property: vm.IPAsName ? "name" : "ip",
        filter_rules: vm.filterBySearch ? 1 : 0,
      };
      this.getServiceUsers(params);
    },
  },
};
</script>

<style>
</style>
