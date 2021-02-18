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
      reactiveData="true"
      :variableHeight="tabheight"
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
  props: ["data"],
  data: () => ({
    tabheight: 100,
  }),
  computed: {
    ...mapState("services", ["adminsData"]),
  },
  mounted() {
    this.calcHeight();
  },
  methods: {
    calcHeight() {
      let restheight =
        window.innerHeight - this.$refs.adminstable.getBoundingClientRect().top;
      this.tabheight = restheight - 3;
    }
  }
};
</script>
