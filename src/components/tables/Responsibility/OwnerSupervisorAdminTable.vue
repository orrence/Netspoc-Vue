<template>
  <div id="table_supervisor_admins">
    <Tabulator
      :name="`Supervisoradmins`"
      :reactiveData="true"
      :columns="tabletitle"
      :data="data"
      :selectable="false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Tabulator from "../Tabulator";
import Vue from "vue";

export default {
  components: {
    Tabulator,
  },
  props: ["selection"],
  data: () => ({
    data: [],
  }),
  watch: {
    selection: function () {
      this.data = [];
      this.loadOwnerSupervisorAdmins();
    },
  },
  computed: {
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
    tabletitle() {
      return [
        {
          title: "Verantwortliche für " + this.selection.selectedSupervisor,
          field: "email",
        },
      ];
    },
  },
  mounted() {
    if (this.data.length > 0) {
      this.tabulator.selectRow(this.data[0].email);
    }
  },
  methods: {
    loadOwnerSupervisorAdmins() {
      var vm = this;
      const formData = new FormData();
      // We need both, owner (for get_admins_watchers) and active_owner (for validate_owner)
      formData.append("owner", vm.selection.selectedSupervisor);
      formData.append("active_owner", vm.selection.selectedSupervisor);
      Vue.axios
        .post("get_admins_watchers", formData)
        .then((res) => {
          let records = res.data.records;
          if (records.length > 0) {
            this.data = records;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
