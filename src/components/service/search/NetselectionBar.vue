<template>
  <v-row dense>
    <v-col>
      <v-container fluid>
        <v-tabs
          background-color="lightgray"
          v-model="networkselection"
          slider-color="orange"
          grow
        >
          <v-tab>Netzauswahl</v-tab>
        </v-tabs>
        <v-tabs-items v-model="networkselection">
          <v-tab-item>
            <NetworkTable @selectionUpdate="captureSelectionUpdate" />
          </v-tab-item>
        </v-tabs-items>

        <v-row dense :justify="'end'">
          <v-col>
            <v-btn block color="success" @click="searchUpdate">Auswählen</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import NetworkTable from "../../tables/Network/NetworkTable";
import urlSearchParams from "../../mixins/urlSearchParams";
import EventBus from "../../../plugins/event-bus";
import { mapState } from "vuex";

export default {
  mixins: [urlSearchParams],
  components: {
    NetworkTable,
  },
  data: () => ({
    cluster: {},
    networkselection: 0,
    search_networks: [],
  }),
  computed: {
    ...mapState("services", ["searchInput"]),
  },
  methods: {
    setSearchParams() {
      this.cluster = this.getFiltersFromUrl(this.cluster, true);
    },
    changeTab(num) {
      this.cluster.tabname = this.tabnames[num];
    },

    searchUpdate() {
      	this.$store.commit("services/SET_LOADING_CIRCLE", true);
      this.$emit("closeSearch");
      this.emitSearchInputToParent();
      this.updateUrlHash(this.$store.getters["services/getsearchInputPlain"]);

      EventBus.$emit("selectionUpdated", "network");
      this.$emit("changeBadgeVal", this.search_networks);
    },
    captureSelectionUpdate(data) {
      this.search_networks = data;

      // this.$store.commit("services/SET_NETWORK_SELECTION", { ...this.cluster.search_networks });
    },
    emitSearchInputToParent() {
      this.$store.commit("services/SET_NETWORK_SELECTION", {
        search_networks: this.search_networks,
      });
    },
  },
};
</script>