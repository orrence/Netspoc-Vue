<template>
  <div v-if="dataIsLoaded" id="table_supervisors">
    <Tabulator :name="`Supervisors`" selectfirstrow="true" :tableconfig="{
    reactiveData: true,
    selectableRows: true,
    index: 'name',
    rowSelected: passOnSelectionUpdate,
  }" :columns="[
    {
      title: 'Übergeordnete',
      field: 'name',
    },
  ]" :data="data" />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapState, mapGetters } from "vuex";
import urlSearchParams from "../c../../../mixins/urlSearchParams";
import Vue from "vue";

export default {
  mixins: [urlSearchParams],
  props: ["height"],
  components: {
    Tabulator,
  },
  data: () => ({
    data: [],
    selectionModel: "",
    dataIsLoaded: false,
  }),
  created() {
    this.loadOwnerSupervisors();
  },
  computed: {
    ...mapState(["active"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    data: {
      handler() {
        if (this.data.length > 0) {
          this.passOnSelectionUpdate(this.data[0]);
        }
      },
    },
    active: {
      deep: true,
      handler() {
        this.dataIsLoaded = false;
        this.loadOwnerSupervisors();
      },
    },
  },
  methods: {
    loadOwnerSupervisors() {
      var vm = this;
      const formData = new FormData();
      formData.append("active_owner", vm.getActiveOwner);
      formData.append("history", vm.getActivePolicy);
      Vue.axios
        .post("get_supervisors", formData)
        .then((res) => {
          let records = res.data.records;
          if (records.length > 0) {
            this.data = records;
            this.dataIsLoaded = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    passOnSelectionUpdate(row) {
      let name = row.name;
      if (name === undefined) {
        name = row.getData().name;
      }
      const payload = {
        selectedSupervisor: name,
      };
      this.$emit("supervisorSelected", payload);
    },
  },
};
</script>
