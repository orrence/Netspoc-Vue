<template>
  <div :id="compID" ref="tableBox">
    <div v-if="!showLoadingCircle">
      <Tabulator :initialSort="[
        { column: 'name', dir: 'asc' }
      ]" selectfirstrow="true" :tableconfig="{
        reactiveData: true,
        selectableRows: true,
        index: 'name',
        rowSelected: passOnSelectionUpdate,
      }" :showCountHeader="true" :name="'Dienste'" :columns="[
          {
            title: 'Name',
            field: 'name',
            sorter: 'caseinsensitive'
          },
        ]" :groupBy="''" :data="servicesData" />
    </div>
    <div v-else style="min-height: 400px">
      Lade Daten
    </div>
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
    tableheight: 200,
  }),
  computed: {
    ...mapState("services", ["servicesData", "showLoadingCircle"]),

  },
  watch: {
    servicesData: {
      handler() {
        if (this.activetab && this.servicesData.length > 0) {
          this.updateServiceSelection([this.servicesData[0]]);
        }
      },
    },
  },
  methods: {
    ...mapActions("services", ["getServicesList", "updateServiceSelection"]),

    passOnSelectionUpdate(row) {
      this.updateServiceSelection([row.getData()]);
    },
  },
};
</script>
