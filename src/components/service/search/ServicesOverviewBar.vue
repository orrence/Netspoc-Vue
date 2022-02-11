<template>
  <v-row dense>
    <v-col>
      <v-container fluid>
        <div>
          <ServicesOverviewTable :height="tableHeight" />
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import ServicesOverviewTable from "../../tables/Service/ServicesOverviewTable";

export default {
  components: {
    ServicesOverviewTable,
  },
  data: () => ({
    cluster: {},
    tableHeight: 100,
  }),
  computed: {
    isLoadingComplete: function () {
      return this.active.owner != null && this.active.policy != null;
    },
  },
  mounted() {
    this.calcHeight();
  },
  methods: {
    calcHeight() {
      let tabheight =
        window.innerHeight -
        //this.$refs.servicesoverview.getBoundingClientRect().top -
        440;
      this.tableHeight = tabheight;
    },
  },
};
</script>