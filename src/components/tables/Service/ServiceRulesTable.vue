<template>
  <div id="table_services_rules">
    <additional-service-info />
    <div ref="servicerulestable">
      <Tabulator :name="`Dienstdetails`" :columns="[
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
      ]" reactiveData="true" :tableconfig="{}" :variableHeight="tabheight" :data="rulesData" @resizeTab="onResizeTab"
        :selectableRows="false" :groupBy="serviceSelection.length > 1 ? 'service' : ''" />
    </div>
    <AdminsTable :data="rulesAdminsData" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Tabulator from "../Tabulator";
import AdditionalServiceInfo from "../../service/detail/AdditionalServiceInfo";
import AdminsTable from "../../tables/AdminsTable";

export default {
  components: {
    Tabulator,
    AdditionalServiceInfo,
    AdminsTable,
  },
  props: ["search_input"],
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
      "rulesAdminsData",
      "IPAsName",
      "expandUser",
      "filterBySearch",
    ]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    serviceSelection: function () {
      if (this.serviceSelection.length > 0) {
        this.getRules();
      }
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
      this.calcHeight();
    },
    getRules() {
      this.getServiceRules();
    },
  },
};
</script>

<style></style>
