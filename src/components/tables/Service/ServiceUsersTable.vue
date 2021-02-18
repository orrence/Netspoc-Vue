<template>
  <div id="table_services_user" ref="serviceuserstable">
    <Tabulator
      selectfirstrow="true"
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
      @resizeTab="onResizeTab"
      :variableHeight="tabheight"
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
    tabheight: 100,
  }),
  computed: {
    ...mapState("services", ["usersData", "searchInput", "serviceSelection"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    serviceSelection: function () {
      this.getUsers();
    },
  },
  mounted() {
    let restheight =
      (window.innerHeight -
        this.$refs.serviceuserstable.getBoundingClientRect().top) *
      0.5;
  
    this.tabheight = restheight;
    this.getUsers();
  },
  methods: {
    ...mapActions("services", ["getServiceUsers"]),
    passOnSelectionUpdate(data) {
      this.$store.dispatch("services/getAdminsData", data.getData().owner);
    },
    getUsers() {
      var vm = this;

      if (vm.serviceSelection.length !== 1) {
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
