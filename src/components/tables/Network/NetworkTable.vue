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
          //formatter: 'tickCross',
          // titleFormatter: 'rowSelection',
          hozAlign: 'center',
          width: 10,
          headerSort: false,
          field: 'selected',
          cellClick: (e, cell) => this.cellclicked(e, cell),
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
      :rowClickableFn="true"
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
  mounted() {
     this.loadNetworks();
  },
  methods: {
    ...mapActions("networks", ["getNetworks"]),
    loadNetworks() {
      var vm = this; // get vue instance
      /* if (!vm.getActiveOwner) {
        vm.data = [];
        return;
      } */
      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        chosen_networks: "",
      };

      this.getNetworks(params).then(function () {
        let filters = vm.getFiltersFromUrl(
          vm.$store.getters["services/getsearchInputPlain"],
          true
        );

        vm.networks = filters.search_networks;
      });
    },
    cellclicked(e, cell) {
      cell.setValue(!cell.getValue());
      e.stopPropagation();
    },
    passOnSelectionUpdate(data) {
      this.$emit(
        "selectionUpdate",
        data.map((row) => row.name)
      );
    },
  },
};
</script>
