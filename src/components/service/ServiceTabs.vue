<template>
  <v-card tile>
    <v-tabs @change="onChangeTab" v-model="serviceTabModel" background-color="lightgray"  slider-color="orange">
      <v-tab>Eigene</v-tab>
      <v-tab>Genutzte</v-tab>
      <v-tab>Nutzbare</v-tab>
      <v-tab>
        <v-icon>search</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="serviceTabModel">
      <v-tab-item :key="0">
        <ServiceTable :servicedata="servicesData" compID="table_services_own" />
      </v-tab-item>
      <v-tab-item :key="1">
        <ServiceTable :servicedata="servicesData" compID="table_services_used"/>
      </v-tab-item>
      <v-tab-item :key="2">
        <ServiceTable :servicedata="servicesData" compID="table_services_usable"/>
      </v-tab-item>
      <v-tab-item :key="3">
        <ServiceTable :servicedata="servicesData" compID="table_services_searchresult"/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import ServiceTable from "../tables/Service/ServiceTable";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    ServiceTable,
  },
  props: ["serviceTab"],
  data: () => ({
    relations: ["owner", "user", "visible"],
  }),
  computed: {
    ...mapState("services", ["searchInput"]),
    ...mapState(["active"]),
    ...mapState("services", ["servicesData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
    serviceTabModel: {
			get () { return this.serviceTab},
			set (val) {
         this.$emit("selectionUpdate", val);
			}
		}
  },
  watch: {
    
    searchInput: {
        deep:true,
        handler() {
             this.tabservices = 3;
            this.getServices(3);
        }
    },
    active: {
        deep: true,
        handler() {
            this.getServices(this.serviceTabModel);
        }
    }
  },
  methods: {
    ...mapActions("services", ["getServicesList", "updateServiceSelection"]),
    onChangeTab(data) {

      this.getServices(data);
      // this.$store.dispatch('requestActive');
    },
    getServices(tabitem) {
      var vm = this; // get vue instance

      if (!vm.getActiveOwner || (typeof this.relations[tabitem] === "undefined" && !vm.searchInput)) {
        this.updateServiceSelection([]);
        // vm.$emit("selectionUpdate", vm.data);
        return;
      }

      const payload =
        typeof this.relations[tabitem] !== "undefined"
          ? {
              chosen_networks: "",
              active_owner: vm.getActiveOwner,
              history: vm.getActivePolicy,
              relation: this.relations[tabitem],
            }
          : {
              active_owner: vm.getActiveOwner,
              history: vm.getActivePolicy,
              relation: "",
              search_ip1:
                vm.searchInput.tab_search === 0
                  ? vm.searchInput.search_ip1
                  : "",
              search_ip2:
                vm.searchInput.tab_search === 0
                  ? vm.searchInput.search_ip2
                  : "",
              search_proto:
                vm.searchInput.tab_search === 0
                  ? vm.searchInput.search_proto
                  : "",
              search_supernet:
                vm.searchInput.tab_search === 0 &&
                vm.searchInput.search_supernet
                  ? "on"
                  : "",
              search_subnet:
                vm.searchInput.tab_search === 0 && vm.searchInput.search_subnet
                  ? "on"
                  : "",
              search_range:
                vm.searchInput.tab_search === 0 && vm.searchInput.search_range
                  ? "on"
                  : "",
              search_string:
                vm.searchInput.tab_search === 1
                  ? vm.searchInput.search_string
                  : "",
              search_in_desc:
                vm.searchInput.tab_search === 1 &&
                vm.searchInput.search_description
                  ? "on"
                  : "",
              chosen_networks:
                vm.searchInput.tab_search === 2
                  ? vm.searchInput.search_networks.join(",")
                  : "",
              search_own: vm.searchInput.search_own ? "on" : "",
              search_used: vm.searchInput.search_used ? "on" : "",
              search_visible: vm.searchInput.search_visible ? "on" : "",
              search_disable_at: vm.searchInput.search_disable_at ? "on" : "",
              search_case_sensitive: vm.searchInput.search_case_sensitive
                ? "on"
                : "",
              search_exact: vm.searchInput.search_exact ? "on" : "",
            };

      this.getServicesList({ data: payload });
    },
  },
};
</script>