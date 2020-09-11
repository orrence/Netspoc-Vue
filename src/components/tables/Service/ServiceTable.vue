<template>
  <Tabulator
    :name="'Dienste'"
    reactiveData="true"
    :columns="[
	{
		title: 'Name',
		field: 'name' 
	},
]"
    :data="servicesData"
    :selectable="true"
    :groupBy="''"
    @selectionUpdate="passOnSelectionUpdate"
  />
</template>

<script>
import Tabulator from "../Tabulator";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Tabulator,
  },
  props: ["relation", "search_input"],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("services", ["servicesData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.getServices();
      },  
    },
    search_input: {
      deep: true,
      handler() {
        this.getServices();
      },
    },
  },
  mounted() {
    console.log("SERVICE DATA");
    console.log(this.servicesData);
    console.log(this.active);
    this.getServices();
  },
  methods: {
    ...mapActions("services", ["getServicesList"]),
    getServices() {
      var vm = this; // get vue instance

      if (!vm.getActiveOwner || (!vm.relation && !vm.search_input)) {
        vm.data = [];
        vm.$emit("selectionUpdate", vm.data);
        return;
      }

      console.log(vm.getActivePolicy);
      const payload = vm.relation
        ? {
            chosen_networks: "",
            active_owner: vm.getActiveOwner,
            history: vm.getActivePolicy,
            relation: vm.relation,
          }
        : {
            active_owner: vm.getActiveOwner,
            history: vm.getActivePolicy,
            relation: "",
            search_ip1:
              vm.search_input.tab_search === 0
                ? vm.search_input.search_ip1
                : "",
            search_ip2:
              vm.search_input.tab_search === 0
                ? vm.search_input.search_ip2
                : "",
            search_proto:
              vm.search_input.tab_search === 0
                ? vm.search_input.search_proto
                : "",
            search_supernet:
              vm.search_input.tab_search === 0 &&
              vm.search_input.search_supernet
                ? "on"
                : "",
            search_subnet:
              vm.search_input.tab_search === 0 && vm.search_input.search_subnet
                ? "on"
                : "",
            search_range:
              vm.search_input.tab_search === 0 && vm.search_input.search_range
                ? "on"
                : "",
            search_string:
              vm.search_input.tab_search === 1
                ? vm.search_input.search_string
                : "",
            search_in_desc:
              vm.search_input.tab_search === 1 &&
              vm.search_input.search_description
                ? "on"
                : "",
            chosen_networks:
              vm.search_input.tab_search === 2
                ? vm.search_input.search_networks.join(",")
                : "",
            search_own: vm.search_input.search_own ? "on" : "",
            search_used: vm.search_input.search_used ? "on" : "",
            search_visible: vm.search_input.search_visible ? "on" : "",
            search_disable_at: vm.search_input.search_disable_at ? "on" : "",
            search_case_sensitive: vm.search_input.search_case_sensitive
              ? "on"
              : "",
            search_exact: vm.search_input.search_exact ? "on" : "",
          };

      this.getServicesList({ data: payload })
        .then(function () {
          //vm.data = response.data.records;
        })
        .catch(function (error) {
          vm.data = [];
          alert("service_list: " + error);
        });
    },
    passOnSelectionUpdate(data) {
      this.$emit("selectionUpdate", data);
    },
  },
};
</script>
