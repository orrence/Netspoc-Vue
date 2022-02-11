<template>
  <div id="table_servicesoverview">
    <Tabulator
      layout="fitColumns"
      :name="`Diensteübersicht`"
      reactiveData="true"
      :columns="[
        {
          title: 'Aktion',
          field: 'action',
          formatter: 'textarea',
          width: 50,
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
          field: 'proto',
          formatter: 'textarea',
        },
      ]"
      :data="servicesOverviewData"
      :selectable="false"
      :groupBy="'service'"
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
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("services", ["servicesOverviewData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {},
  mounted() {
    this.loadServicesOverview();
  },
  methods: {
    ...mapActions("services", ["getServicesOverview"]),
    loadServicesOverview() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
      };
      this.getServicesOverview(params);
    },
  },
};
</script>

<style>
</style>
