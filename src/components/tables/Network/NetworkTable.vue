<template>
  <div id="table_networks">
    <Tabulator
      :name="`Netze`"
      :tableconfig="{
        reactiveData: true,
        selectable: 20,
        index: 'name',
        rowSelectionChanged: passOnSelectionUpdate,

      }"
      :columns="[
        {
          formatter: 'rowSelection',
          titleFormatter: 'rowSelection',
          hozAlign: 'center',
          width: 10,
          headerSort: false,
          field: 'selected',
        },
        {
          title: 'IP-Addresse',
          field: 'ip',
          sorter: 'ip',
        },
        {
          title: 'Name',
          field: 'name',
        },
        {
          title: 'Verantwortungsbereich',
          field: 'owner',
        },
      ]"
      :data="networksData"
      :selectedNetworks="networks"
      :groupBy="''"
      :height="height"
  
    />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapState, mapGetters, mapActions } from "vuex";
import urlSearchParams from "../c../../../mixins/urlSearchParams";

export default {
  mixins: [urlSearchParams],
  props: ["height"],
  components: {
    Tabulator,
  },
  data: () => ({
    data: [],
    selectionModel: "",
    networks: "",
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("networks", ["networksData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.loadNetworks();
      },
    },
  },
  created() {},
  methods: {
    ...mapActions("networks", ["getNetworks"]),
    loadNetworks() {
      var vm = this; // get vue instance
      if (!vm.getActiveOwner) {
        vm.data = [];
        return;
      }
      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        chosen_networks: "",
      };

      this.getNetworks(params).then(function (response) {
        console.log("AXIOS RESPOSNE");
         let filters = vm.getFiltersFromUrl(
          vm.$store.getters["services/getsearchInputPlain"],
          true
        );
       
        vm.networks = filters.search_networks; 
        console.log(response);
      });
    },
    cellclicked() {},
    passOnSelectionUpdate(data) {
      this.$emit(
        "selectionUpdate",
       data.map((row) => row.name)
      );
    },
  },
};
</script>
