<template>
  <div id="table_networks_resource">
    <Tabulator
      :name="`Netzressourcen`"
      reactiveData="true"
      :columns="[
	{
		title: 'IP-Addresse',
		field: 'child_ip', sorter:'ip'
	},
	{
		title: 'Name',
		field: 'child_name'
	},
	{
		title: 'Verantwortungsbereich',
		field: 'child_owner'
	}
]"
      :data="networkResourcesData"
      :selectable="false"
      :groupBy="'name'"
    />
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
      var vm = this; // get vue instance

      if (!vm.getActiveOwner || !vm.getActivePolicy || !vm.selection) {
        vm.data = [];
        return;
      }

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        selected_networks: vm.selection.join(","),
      };
      this.getNetworkResources(params);
    },
  },
};
</script>

<style>
</style>
