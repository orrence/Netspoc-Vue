<template>
  <div id="table_networks_resource">
    <Tabulator :name="`Netzressourcen`" reactiveData="true" :columns="[
      {
        title: 'IP-Addresse',
        field: 'child_ip',
        sorter: 'ip',
      },
      {
        title: 'Name',
        field: 'child_name',
      },
      {
        title: 'Verantwortungsbereich',
        field: 'child_owner',
      },
    ]" :data="networkResourcesData" :selectableRows="false" :groupBy="'name'" :groupHeader="this.setGroupHeader" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import Tabulator from "../Tabulator";
export default {
  components: {
    Tabulator,
  },
  props: ["selection"],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState("networks", ["networkResourcesData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    selection: function () {
      this.data = [];
      this.loadNetworkResources();
    },
  },
  mounted() {
    this.loadNetworkResources();
  },
  methods: {
    ...mapActions("networks", ["getNetworkResources"]),
    loadNetworkResources() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        selected_networks: vm.selection.join(","),
      };
      this.getNetworkResources(params);
    },
    setGroupHeader(value, count) {
      //value - the value all members of this group share
      //count - the number of rows in this group
      let what = count == 1 ? "Host/Interface" : "Hosts/Interfaces";
      return value + " (" + count + " " + what + ")"; //return the header contents
    },
  },
};
</script>

<style></style>
