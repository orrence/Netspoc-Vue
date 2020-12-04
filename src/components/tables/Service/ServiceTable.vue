<template>
  <div :id="compID">
    <div v-if="!showLoadingCircle">
      <Tabulator
        selectfirstrow="true"
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
       
        :data="servicesData"
        :groupBy="'affe'"
      />
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
