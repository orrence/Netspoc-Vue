<template>
  <div id="table_supervisors">
    <Tabulator
      :name="`Supervisors`"
      selectfirstrow="true"
      :tableconfig="{
        reactiveData: true,
        selectable: 1,
        index: 'name',
        rowSelected: passOnSelectionUpdate,
      }"
      :columns="[
        {
          title: 'Übergeordnete',
          field: 'name',
        },
      ]"
      :data="data"
    />
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
  }),
  mounted() {
    this.loadOwnerSupervisors();
  },
  computed: {
    ...mapState(["active"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
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
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    passOnSelectionUpdate(row) {
      const payload = {
        selectedSupervisor: row.getData().name,
      };

      this.$emit("supervisorSelected", payload);
    },
  },
};
</script>

