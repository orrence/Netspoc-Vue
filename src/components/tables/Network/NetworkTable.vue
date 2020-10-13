<template>
  <div id="table_networks">
    
    <Tabulator
      :name="`Netze`"
      reactiveData="true"
      :columns="[
      {
        formatter:'rowSelection', 
        titleFormatter:'rowSelection',
        hozAlign:'center',
        width: 10,
         headerSort:false,
       
      },
	{
		title: 'IP-Addresse',
		field: 'ip',
		sorter: 'ip',
	},
	{
		title:'Name',
		field:'name',
	},
	{
		title:'Verantwortungsbereich',
		field:'owner',
	},
]"
      :data="networksData"
      :selectable="true"
      :groupBy="''"
      :height="height"
      @selectionUpdate="passOnSelectionUpdate"
    />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: ["height"],
  components: {
    Tabulator,
  },
  data: () => ({
    data: [],
    selectionModel: '',
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
      if (!vm.getActiveOwner) {
        vm.data = [];
        return;
      }
      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        chosen_networks: "",
      };

      this.getNetworks(params);
    },
    cellclicked() {
      console.log('TEST');
    },
    passOnSelectionUpdate(data) {
      console.log('SELECTION UPDATE');
      console.log(data);
      this.$emit(
        "selectionUpdate",
        data.map((row) => row.name)
      );
    },
  },
};
</script>
