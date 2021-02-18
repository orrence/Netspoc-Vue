<template>
  <div id="table_services_rules">
    <additional-service-info />
    <div ref="servicerulestable">
      <Tabulator
        :name="`Dienstdetails`"
        :columns="[
          {
            title: 'Aktion',
            field: 'action',
            formatter: 'textarea',
            width: 77,
          },
          {
            title: 'Quelle',
            field: 'src',
            formatter: 'textarea',
            sorter: 'ip',
          },
          {
            title: 'Ziel',
            field: 'dst',
            formatter: 'textarea',
            sorter: 'ip',
          },
          {
            title: 'Protokoll',
            field: 'prt',
            formatter: 'textarea',
            width: 92,
          },
        ]"
        reactiveData="true"
        :tableconfig="{}"
        :variableHeight="tabheight"
        :data="rulesData"
         @resizeTab="onResizeTab"
        :selectable="false"
        :groupBy="serviceSelection.length > 1 ? 'service' : ''"
      />
    </div>
    <AdminsTable
      :data="rulesAdminsData"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Tabulator from "../Tabulator";
import Vue from "vue";
import AdditionalServiceInfo from "../../service/detail/AdditionalServiceInfo";
import AdminsTable from "../../tables/AdminsTable";

export default {
  components: {
    Tabulator,
    AdditionalServiceInfo,
    AdminsTable

  },
  props: ["expandUser", "IPAsName", "filterBySearch", "search_input"],
  data: () => ({
    data: [],
    tabheight: 100,
  }),
  computed: {
    ...mapState("services", [
      "rulesData",
      "serviceTabNumber",
      "searchInput",
      "serviceSelection",
      "rulesAdminsData"
    ]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    serviceSelection: function () {
      this.getRules();
    },
    expandUser: function () {
      this.getRules();
    },
    IPAsName: function () {
      this.getRules();
    },
    filterBySearch: function () {
      this.getRules();
    },
  },
  mounted() {
    this.calcHeight();
  },
  methods: {
    ...mapActions("services", ["getServiceRules"]),
    calcHeight() {
      let restheight =
        (window.innerHeight -
          this.$refs.servicerulestable.getBoundingClientRect().top) *
        0.5;
      this.tabheight = restheight;
    },
    onResizeTab() {
      console.log('RESIZE IT NOW');
      this.calcHeight();
    },
    createPayloadElement(payloadObj) {
      let payload = {};

      for (const [key, value] of Object.entries(payloadObj)) {
        if (typeof value == "boolean") {
          let boolval = "";
          if (value == true) {
            boolval = "on";
          }
          Vue.set(payload, key, boolval);
        } else {
          Vue.set(payload, key, value);
        }
      }
      return payload;
    },
    getRules() {
      var vm = this; // get vue instance
      if (vm.serviceSelection.length !== 1) {
        return;
      }

      let rulepayload = {};
      let textsearch_payload = {};
      let generalpayload = {};

      // TO-DO Code kommentieren und an einer zentralen Stelle widerverwendbar machen
      if (vm.filterBySearch && vm.serviceTabNumber === 3) {
        rulepayload = this.createPayloadElement(vm.searchInput.rules);
        textsearch_payload = this.createPayloadElement(
          vm.searchInput.textsearch
        );
        generalpayload = this.createPayloadElement(vm.searchInput.general);
      }

      const payload = {
        expand_users: vm.expandUser ? 1 : 0,
        display_property: vm.IPAsName ? "name" : "ip",
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        service: vm.serviceSelection.map((row) => row.name).join(","),
        filter_rules: vm.filterBySearch ? 1 : 0,
        ...rulepayload,
        ...textsearch_payload,
        ...generalpayload,
        chosen_networks: vm.searchInput.search_networks.join(","),
      };
      this.getServiceRules(payload);
    },
  },
};
</script>

<style>
</style>
