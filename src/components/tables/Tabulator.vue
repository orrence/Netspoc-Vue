<template>
  <div>
    <v-row dense :justify="'space-between'" :align="'center'">
      <v-col v-if="showDownloadButtons" cols="auto" class="pa-0">
        <v-btn icon color="red lighten-2" @click="downloadAsPDF">
          <span class="material-icons">picture_as_pdf</span>
        </v-btn>

        <v-btn icon color="green lighten-2" @click="downloadAsExcel">
          <span class="material-icons">border_all</span>
        </v-btn>
      </v-col>

      <v-col v-if="showCountHeader" cols="auto">
        <div v-if="selectedRows > 1">
          {{ selectedRows }} {{ name }} ausgewählt
        </div>
        <div v-else>{{ data.length }} {{ name }} verfügbar</div>
      </v-col>
    </v-row>
    <v-container
      fluid
      class="pa-1"
      ref="tablecontainer"
      :style="{ height: tabulatorheight + 'px' }"
    >
      <div ref="table" />
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Tabulator from "tabulator-tables";
import { jsPDF } from "jspdf";

export default {
  props: {
    tableconfig: Object,
    groupBy: String,
    showCountHeader: Boolean,
    columns: Array,
    data: Array,
    height: String,
    name: String,
    variableHeight: Number,
    maxSelections: Number,
    selectedNetworks: [Array, String],
    selectfirstrow: String,
    showDownloadButtons: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isVisible: false,
    isLoaded: false,
    newConfig: false,
    tabulatorheight: 200,
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
    variableHeight: {
      handler: function () {
        // TO-DO Dynamisch berechnen
        this.tabulatorheight = this.variableHeight - 36;
      },
    },
    data: {
      handler: function () {
        this.config.data = this.data;
        this.tabulator.setData(this.config.data);

        this.isLoaded = true;
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

    let me = this;
    this.config.columns = this.columns;
    this.config.data = this.data;
    this.config.groupBy = this.groupBy;

    if (typeof this.variableHeight != "number") {
      let tabheight =
        window.innerHeight -
        this.$refs.tablecontainer.getBoundingClientRect().top -
        4;
      this.tabulatorheight = tabheight;
    } else {
      this.tabulatorheight = this.variableHeight;
    }
    this.config.maxHeight = "100%";
    this.config.height = "100%";

    this.config = Object.assign({}, this.config, this.tableconfig);
    this.config.rowClick = function (e, row) {
      me.tabulator.deselectRow();
      me.tabulator.selectRow(row.getData().name);
    };

    this.newTable();

    if (this.data.length > 0 && this.selectfirstrow) {
      this.tabulator.selectRow(this.config.data[0].name);
    }
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
      console.log(jsPDF);
      this.tabulator.download("pdf", `${this.name}.pdf`, {
        orientation: "portrait", //set page orientation to portrait
        title: this.name, //add title to report
      });
    },
    downloadAsExcel() {
      console.log(this.tabulator.download())
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