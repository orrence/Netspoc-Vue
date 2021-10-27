<template>
  <div id="table_admins" ref="adminstable">
    <Tabulator
      :name="`Verantwortliche`"
      :columns="[
        {
          title: 'Verantwortung',
          field: 'email',
        },
      ]"
      :tableconfig="{
        reactiveData: true,
        selectable: 1,
        rowSelected: passOnSelectionUpdate,
      }"
      reactiveData="true"
      :variableHeight="variableHeight"
      :data="data"
      @resizeTab="calcHeight"
      :showCountHeader="false"
    />
  </div>
</template>

<script>
import Tabulator from "./Tabulator";
import { mapState } from "vuex";

export default {
  components: {
    Tabulator,
  },
  props: ["data","adminheight"],
  data: () => ({
    tabheight: 100,
  }),
  computed: {
    ...mapState("services", ["adminsData"]),
    variableHeight() {
      //console.log('ADMIN HEIGHT ', this.adminheight);
      if(this.adminheight) {
        return this.adminheight
      } else {
        return this.tabheight;
      }
    }
  },
  mounted() {
    this.calcHeight();
  },
  methods: {
    calcHeight() {
      let restheight =
        window.innerHeight - this.$refs.adminstable.getBoundingClientRect().top;
      this.tabheight = restheight - 20;
    },
    passOnSelectionUpdate(row) {
      window.location.href = "mailto:"+row.getData().email;
    },
  },
};
</script>
