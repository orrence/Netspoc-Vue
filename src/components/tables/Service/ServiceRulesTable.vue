<template>
  <div id="table_services_rules">
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
      :data="rulesData"
      :selectable="false"
      :groupBy="serviceSelection.length > 1 ? 'service' : ''"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Tabulator from "../Tabulator";
import Vue from 'vue';

export default {
  components: {
    Tabulator,
  },
  props: [
    "expandUser",
    "IPAsName",
    "filterBySearch",
    "search_input",
  ],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState("services", ["rulesData", "serviceTabNumber", "searchInput","serviceSelection"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    serviceSelection: function () {
      console.log('LOAD SELECTION');
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
  methods: {
    ...mapActions("services", ["getServiceRules"]),

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
      if( vm.serviceSelection.length !== 1) {
        return;
      }
  
      let rulepayload = {};
      let textsearch_payload = {};
      let generalpayload = {};

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
