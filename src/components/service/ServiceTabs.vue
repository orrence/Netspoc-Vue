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
    <v-tabs-items v-model="serviceTabModel" >
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
import { mapState, mapGetters, mapActions } from "vuex";
import EventBus from "../../plugins/event-bus";
import Vue from "vue";
export default {
  components: {
    ServiceTable,
  },
  data: () => ({
    relations: ["owner", "user", "visible"],
  }),
  computed: {
    ...mapState("services", [
      "searchInput",
      "searchArea",
      "serviceTabNumber",
      "showLoadingCircle",
    ]),
    ...mapState(["active"]),
    ...mapState("services", ["servicesData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
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
    var vm = this;
    EventBus.$on("selectionUpdated", function (selection) {
      if (selection == "search") {
        vm.serviceTabModel = 3;
        vm.getServices(3);
      } else if (selection == "start") {
        vm.serviceTabModel = 1;
        vm.getServices(1);
      } else {
    
        vm.getServices(this.serviceTabModel ? "undefined" : 0);
      }
    });
  },
  methods: {
    ...mapActions("services", ["getServicesList"]),
    onChangeTab(data) {
      this.$store.commit("services/SET_LOADING_CIRCLE", true);
      this.getServices(data);
      // this.$store.dispatch('requestActive');
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
    getServices(tabitem) {
      var vm = this; // get vue instance
    
      if (
        !vm.getActiveOwner ||
        (typeof this.relations[tabitem] === "undefined" && !vm.searchInput)
      ) {
        // vm.$emit("selectionUpdate", vm.data);
        return;
      }
      let rulepayload = {};
      let textsearch_payload = {};
      let generalpayload = {};

      rulepayload = this.createPayloadElement(vm.searchInput.rules);
      textsearch_payload = this.createPayloadElement(vm.searchInput.textsearch);
      generalpayload = this.createPayloadElement(vm.searchInput.general);

      let basepayload;
      if (typeof this.relations[tabitem] !== "undefined") {
        basepayload = {
          chosen_networks: vm.searchInput.search_networks.join(","),
          active_owner: vm.getActiveOwner,
          history: vm.getActivePolicy,
          relation: this.relations[tabitem],
        };
      } else {
        basepayload = {
          chosen_networks: vm.searchInput.search_networks.join(","),
          active_owner: vm.getActiveOwner,
          history: vm.getActivePolicy,
          relation: "",
          ...rulepayload,
          ...textsearch_payload,
          ...generalpayload,
        };
      }

      this.getServicesList({ data: basepayload });
    },
  },
};
</script>

<style>

.hidden {
  display: none;
}
</style>