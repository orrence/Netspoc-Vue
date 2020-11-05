<template>
  <div :id="compID">
    <Tabulator
      :tableconfig="{
        reactiveData: true,
        selectable: 1,
        index: 'name',
        rowSelected: passOnSelectionUpdate,
        //rowSelectionChanged: passOnSelectionUpdate
      }"
      :name="'Dienste'"
      :columns="[
        {
          title: 'Name',
          field: 'name',
        },
      ]"
      :selectFirstRow="true"
      :data="servicesData"
      :selectable="true"
      :groupBy="''"
    />
  </div>
</template>

<script>
import Tabulator from "../Tabulator";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    Tabulator,
  },
  props: ["compID", "activetab"],
  data: () => ({
    data: [],
  }),
  computed: {
    ...mapState("services", ["servicesData"]),
  },
  watch: {
    servicesData: {
      handler() {
    
        if (this.activetab) {
          this.updateServiceSelection([this.servicesData[0]]);
        }
      },
    },
  },
  methods: {
    ...mapActions("services", ["getServicesList", "updateServiceSelection"]),

    passOnSelectionUpdate(row) {

      this.updateServiceSelection([row.getData()]);
      //this.$emit("selectionUpdate", data);
    },
  },
};
</script>
