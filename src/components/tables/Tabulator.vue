<template>
  <v-container fluid>
    <v-row dense :justify="'space-between'" :align="'center'">
      <v-col cols="auto">
        <v-btn icon color="red lighten-2" @click="downloadAsPDF">
          <span class="material-icons">picture_as_pdf</span>
        </v-btn>

        <v-btn icon color="green lighten-2" @click="downloadAsExcel">
          <span class="material-icons">border_all</span>
        </v-btn>
      </v-col>

      <v-col v-if="selectable" cols="auto">
        <div v-if="selectedRows > 1">
          {{ selectedRows }} {{ name }} ausgewählt
        </div>
        <div v-else>{{ data.length }} {{ name }} verfügbar</div>
      </v-col>

      <v-col v-if="selectable > 1" cols="auto">
    
        <v-btn icon color="orange lighten-2" @click="deselectAll">
          <span class="material-icons">remove_circle_outline</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div ref="table" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import Tabulator from "tabulator-tables";

export default {
  props: [
    "tableconfig",
    "groupBy",
    "selectable",
    "columns",
    "data",
    "height",
    "name",
    "maxSelections",
    "selectedNetworks",
    "selectFirstRow",
  ],
  data: () => ({
    isVisible: false,
    newData: false,
    isLoaded: false,
    newConfig: false,
    tabulator: null, //variable to hold your table
    selected: [],
    selectedRows: 0,
    lastClick: 0,
    config: {
      columns: [],
      data: [],
      groupBy: "",
      layout: "fitColumns",
      layoutColumnsOnNewData: true,
      placeholder: "No Data Available",
    },
  }),
  computed: mapGetters(["getActiveOwner", "getActivePolicy"]),
  watch: {
    //update table if data changes
    data: {
      handler: function () {
        this.config.data = this.data;
        this.tabulator.setData(this.config.data);
        if (this.data.length > 0) {
          if (typeof this.selectFirstRow != "undefined") {
            this.tabulator.selectRow(this.config.data[0].name);
          }
        }

        this.isLoaded = true;
        this.newData = false;
      },
    },
    groupBy: {
      handler: function () {
        if (this.isVisible) {
          this.config.groupBy = this.groupBy;
          this.tabulator.setGroupBy(this.config.groupBy);
          this.newConfig = false;
        } else {
          this.newConfig = true;
        }
      },
    },
    selectedNetworks: {
      handler: function () {
        this.selectedNetworks.forEach((param) => {
          this.tabulator.selectRow(param);
        });
      },
    },
  },
  mounted() {
 
    this.config.columns = this.columns;
    this.config.data = this.data;
    this.config.groupBy = this.groupBy;
    this.config.maxHeight = "500px";
    this.config = Object.assign({}, this.config, this.tableconfig);
   
    this.newTable();
  },
  methods: {
    newTable() {
      this.tabulator = new Tabulator(this.$refs.table, this.config);
    },
    selectAll() {
      // this.tabulator.selectRow();
    },
    deselectAll() {
      this.tabulator.deselectRow();
    },
    emitSelectionUpdate() {
      this.$emit("selectionUpdate", this.selected);
    },
   
    downloadAsPDF() {
      this.tabulator.download("pdf", `${this.name}.pdf`, {
        orientation: "portrait", //set page orientation to portrait
        title: this.name, //add title to report
      });
    },
    downloadAsExcel() {
      this.tabulator.download(
        "xlsx",
        `${this.name}_${this.getActiveOwner}_${this.getActivePolicy}.xlsx`,
        { sheetName: this.name }
      );
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>