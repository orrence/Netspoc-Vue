<template>
  <v-card tile class="fill-height" elevation="1">
    <v-tabs
      @change="onChangeTab"
      v-model="serviceTabModel"
      background-color="lightgray"
      slider-color="orange"
    >
      <v-tab>Eigene</v-tab>
      <v-tab>Genutzte</v-tab>
      <v-tab>Nutzbare</v-tab>
      <v-tab v-if="serviceTabModel == 3">
        <v-icon>search</v-icon>
      </v-tab>
    </v-tabs>
    <div :class="!showLoadingCircle ? 'hidden' : ''" class="loadingoverlay">
      <div class="loadingcircle">
        <v-progress-circular
          color="deep-orange"
          indeterminate
          size="94"
        ></v-progress-circular>
      </div>
    </div>
    <v-tabs-items v-model="serviceTabModel">
      <v-tab-item :key="0" transition="false" class="fill-height">
        <ServiceTable
          :activetab="serviceTabModel == 0 ? true : false"
          compID="table_services_own"
        />
      </v-tab-item>
      <v-tab-item :key="1" transition="false">
        <ServiceTable
          :activetab="serviceTabModel == 1 ? true : false"
          compID="table_services_used"
        />
      </v-tab-item>
      <v-tab-item :key="2" transition="false">
        <ServiceTable
          :activetab="serviceTabModel == 2 ? true : false"
          compID="table_services_usable"
        />
      </v-tab-item>
      <v-tab-item v-if="serviceTabModel == 3" :key="3">
        <ServiceTable
          :activetab="serviceTabModel == 3 ? true : false"
          compID="table_services_searchresult"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import ServiceTable from "../tables/Service/ServiceTable";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    ServiceTable,
  },
  computed: {
    ...mapState("services", [
      "serviceTabNumber",
      "showLoadingCircle",
    ]),
    ...mapState(["active"]),
    ...mapState("services", ["servicesData"]),
    serviceTabModel: {
      get() {
        return this.serviceTabNumber;
      },
      set(val) {
        this.$store.commit("services/UPDATE_SERVICE_TAB_NUMBER", val);
      },
    },
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.getServices(this.serviceTabModel);
      },
    },
    servicesData: {
      handler() {
        this.$store.commit("services/SET_LOADING_CIRCLE", false);
      },
    },
  },
  created() {
    this.getServices();
  },
  methods: {
    ...mapActions("services", ["getServicesList"]),
    onChangeTab() {
      this.$store.commit("services/SET_LOADING_CIRCLE", true);
      this.getServices();
    },
    getServices() {
      this.getServicesList();
    },
  },
};
</script>

<style>
.hidden {
  display: none;
}
</style>