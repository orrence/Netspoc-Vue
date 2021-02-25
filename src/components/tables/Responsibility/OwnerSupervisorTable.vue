<template>
  <div id="table_supervisors">
    <Tabulator
      :name="`Verantwortliche`"
      :tableconfig="{
        reactiveData: true,
        selectable: 20,
        index: 'name',
        rowSelectionChanged: passOnSelectionUpdate,
       
      }"
      :columns="[
        {
          title: 'Übergeordnete',
          field: 'name',
        },
      ]"
      :data="ownerSupervisorsData"
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
  }),
  mounted() {
    this.loadOwnerSupervisors();
  },
  computed: {
    ...mapState(["active"]),
    ...mapState("responsibilities", ["ownerSupervisorsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.loadOwnerSupervisors();
      },
    },
    /*
    ownerSupervisorsData: {
      handler() {
        if (this.ownerSuperVisorsData.length > 0) {
          //this.updateSupertvisorSelection([this.ownerSupervisorsData[0]]);
        } 
      },
    },
    */
  },
  methods: {
    ...mapActions("responsibilities", ["getOwnerSupervisors"]),
    loadOwnerSupervisors() {
      var vm = this;

      const params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
      };
      this.getOwnerSupervisors(params);
    },
    passOnSelectionUpdate(data) {
      this.$emit(
        "selectionUpdate",
        data.map((row) => row.name)
      );
    },
  },
}
</script>
