<template>
  <v-card tile>
    <v-tabs
      @change="onChangeTab"
      v-model="serviceTabModel"
      background-color="lightgray"
      slider-color="orange"
    >
      <v-tab>Eigene</v-tab>
      <v-tab>Genutzte</v-tab>
      <v-tab>Nutzbare</v-tab>
      <v-tab>
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
      <v-tab-item :key="0" transition="false">
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
      <v-tab-item :key="3">
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
  props: ["serviceTab"],
  data: () => ({
    relations: ["owner", "user", "visible"],
    showLoadingCircle: true,
  }),
  computed: {
    ...mapState("services", ["searchInput", "searchArea"]),
    ...mapState(["active"]),
    ...mapState("services", ["servicesData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
    serviceTabModel: {
      get() {
        return this.serviceTab;
      },
      set(val) {
        console.log("EMIT TAB UPDATE " + val);
        this.$emit("selectionUpdate", val);
      },
    },
  },
  watch: {
    searchInput: {
      deep: true,
      handler() {
        // this.tabservices = 3;
        // this.getServices(3);
      },
    },
    active: {
      deep: true,
      handler() {
        this.getServices(this.serviceTabModel);
      },
    },
    servicesData: {
      handler() {
        this.showLoadingCircle = false;
      }
    }
  },
  created() {
    var vm = this;
    EventBus.$on("selectionUpdated", function (selection) {
      if (selection == "search") {
        vm.serviceTabModel = 3;
        vm.getServices(3);
      } else {
        vm.getServices(this.serviceTabModel);
      }
    });
  },
  methods: {
    ...mapActions("services", ["getServicesList", "updateServiceSelection"]),
    onChangeTab(data) {
      console.log(data);
      this.showLoadingCircle = true;
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

      console.log("SERVIEC S");
      if (
        !vm.getActiveOwner ||
        (typeof this.relations[tabitem] === "undefined" && !vm.searchInput)
      ) {
        //this.updateServiceSelection([]);
        // vm.$emit("selectionUpdate", vm.data);
        return;
      }
      console.log("PATRICK");
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

<style scoped>
.loadingoverlay {
  position: absolute;
  height: 100%;
  z-index: 999;
  width: 100%;
  background: #fff;
  opacity: 0.9;
}
.loadingcircle {
  position:absolute;
  left: 34%;
  top: 40%;
  margin: 0 auto;
}
.hidden {
  display: none;
}
</style>