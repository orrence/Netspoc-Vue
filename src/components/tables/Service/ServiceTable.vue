<template>
  <div :id="compID" ref="tableBox" class="Tesmnnn"> 
    <div v-if="!showLoadingCircle" >
      <Tabulator
        selectfirstrow="true"
        :tableconfig="{
          reactiveData: true,
          selectable: 1,
          index: 'name',
          rowSelected: passOnSelectionUpdate,
 
         // maxHeight: '400px',
          //rowSelectionChanged: passOnSelectionUpdate
        }"
         :showCountHeader="true"
        :name="'Dienste'"
        :columns="[
          {
            title: 'Name',
            field: 'name',
          },
        ]"
        :groupBy="''"
        :data="servicesData"
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
