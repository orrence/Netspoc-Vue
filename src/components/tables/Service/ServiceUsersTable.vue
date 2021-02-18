<template>
  <div id="table_services_user" ref="serviceuserstable">
    <Tabulator
      selectfirstrow="true"
      :tableconfig="{
        reactiveData: true,
        selectable: 1,

        rowSelected: passOnSelectionUpdate,
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
      @resizeTab="calcHeight"
      :variableHeight="tabheight"
      :groupBy="serviceSelection.length > 1 ? 'service' : ''"
    />
    <AdminsTable :data="usersAdminsData" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Tabulator from "../Tabulator";
import AdminsTable from "../../tables/AdminsTable";

export default {
  components: {
    Tabulator,
    AdminsTable,
  },
  props: ["filterBySearch"],
  data: () => ({
    data: [],
    tabheight: 100,
  }),
  computed: {
    ...mapState("services", [
      "usersData",
      "searchInput",
      "serviceSelection",
      "usersAdminsData",
    ]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    serviceSelection: function () {
      this.getUsers();
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    ...mapActions("services", ["getServiceUsers"]),
    passOnSelectionUpdate(data) {
      let me = this;
      this.$store
        .dispatch("services/getAdminsData", data.getData().owner)
        .then((response) => {
      
          me.$store.dispatch('services/setUsersAdminData',response.data.records)
        });
    },
    calcHeight() {
      let restheight =
        (window.innerHeight -
          this.$refs.serviceuserstable.getBoundingClientRect().top) *
        0.5;

      this.tabheight = restheight;
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
