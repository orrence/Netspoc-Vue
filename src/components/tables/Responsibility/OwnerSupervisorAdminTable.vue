<template>
  <div id="table_supervisor_admins">
    <Tabulator
      :name="`Supervisoradmins`"
      :reactiveData="true"
      :columns="tabletitle"
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
  data: () => ({
    data: [],
  }),
  props: ['selection'],
  watch: {
    supervisorSelection: function () {
      this.loadOwnerSupervisorAdmins();
    }
  },computed: {
    ...mapState("responsibilities", ["ownerSupervisorAdminsData", "supervisorSelection"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
    tabletitle() {
      var vm = this;
      let selectionname = vm.supervisorSelection[0] ? vm.supervisorSelection[0].name : '';
      return [
        {
          title: "Verantwortliche für " + selectionname,
          field: "email",
        },
      ];
    },
  },
  mounted() {
    this.loadOwnerSupervisorAdmins();
  },
  methods: {
    ...mapActions("responsibilities", ["getOwnerSupervisorAdmins"]),
    loadOwnerSupervisorAdmins() {
      var vm = this;
      if (vm.supervisorSelection.length !== 1) {
        return;
      }
      if (!vm.supervisorSelection[0]) {
        return;
      }
     
      this.getOwnerSupervisorAdmins();
    },
  },
};
</script>

<style>
</style>
