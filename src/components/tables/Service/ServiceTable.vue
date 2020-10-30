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
        console.log("DATA HAS CHANGED");
        console.log(this.servicesData[0]);
        if (this.activetab) {
          console.log('HAHAHAH');
          this.updateServiceSelection([this.servicesData[0]]);
        }
      },
    },
  },
  methods: {
    ...mapActions("services", ["getServicesList", "updateServiceSelection"]),

    passOnSelectionUpdate(row) {
      console.log("PAPAPAPPAPAPAPAPAPPAPAPA ");
      console.log(row);
      console.log(row.getData());
      this.updateServiceSelection([row.getData()]);
      //this.$emit("selectionUpdate", data);
    },
  },
};
</script>
