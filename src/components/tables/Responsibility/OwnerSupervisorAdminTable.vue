<template>
  <div id="table_supervisor_admins">
    <Tabulator
      :name="`Supervisoradmins`"
      :reactiveData="true"
      :columns="[
	{
		title: 'Verantwortliche für ',
		field: 'email'
	},
]"
      :data="ownerSupervisorAdminsData"
      :selectable="false"
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
  props: ["selection"],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState("responsibilities", ["ownerSupervisorAdminsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  mounted() {
    this.loadOwnerSupervisorAdmins();
    this.setColumnTitle();
  },
  methods: {
    ...mapActions("responsibilities", ["getOwnerSupervisorAdmins"]),
    setColumnTitle() {
      console.log("Set column title")
      //var colDefs = Tabulator("getColumnDefinitions")
      //console.dir(colDefs)
/*
      //define lookup function
    function paramLookup(){
      //do some processing and return the param object
      return {param1:"green"};
    }

//column definition
{title:5, field:"rating", titleFormatter:"star", titleFormatterParams:paramLookup}
*/
    },
    loadOwnerSupervisorAdmins() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        owner : vm.selection
      };
      console.dir(params)
      this.getOwnerSupervisorAdmins(params);
    },
  },
};
</script>

<style>
</style>
