<template>
  <div class="flex">
    <v-btn
      elevation="2"
      class="mr-4 ml-0"
      raised
      id="btn_open_search"
      color="secondary"
      @click.stop="openNav('search')"
    >
      <v-icon left>mdi-search-web</v-icon>Suchen
    </v-btn>
    <div style="display: inline-flex">
      <v-badge
        color="green"
        overlap
        offset-x="26"
        offset-y="24"
        :value="networkCount"
        :content="networkCount"
      >
        <v-btn
          elevation="2"
          class="mr-4 ml-0"
          raised
          color="secondary"
          @click.stop="openNav('netselection')"
        >
          Netzauswahl
        </v-btn>
      </v-badge>
    </div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      @openServiceOverviewCard="dialog = !dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          elevation="2"
          class="mr-4 ml-0"
          raised
          id="btn_open_service_overview"
          color="secondary"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon left>mdi-search-web</v-icon> Dienstübersicht
        </v-btn>
      </template>
      <div>
        <ServicesOverviewTable :height="tableHeight" />
      </div>
    </v-dialog>

    <v-btn
      :disabled="isSearchActive"
      elevation="2"
      raised
      @click.stop="clearFilter()"
    >
      Filter zurücksetzen</v-btn
    >
  </div>
</template>

<script>
import ServicesOverviewTable from "../tables/Service/ServicesOverviewTable";

export default {
  components: {
    ServicesOverviewTable,
  },
  props: {
    networkCount: {
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    tableHeight: 100,
  }),
  computed: {
    isSearchActive: function () {
      if (this.$route.hash != "") {
        return false;
      }
      return true;
    },
  },
  methods: {
    calcHeight() {
      let tabheight =
        window.innerHeight -
        //this.$refs.servicesoverview.getBoundingClientRect().top -
        40;
      this.tableHeight = tabheight;
    },
    openServiceOverviewCard() {
      this.$emit("openServiceOverviewCard");
    },

    openNav(type) {
      this.$emit("openNavDrawer", type);
    },

    clearFilter() {
      this.$emit("clearSearchFilter");
    },
  },
};
</script>