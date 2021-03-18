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
            <div ref="networkselection">
              <NetworkTable
                :height="tableHeight"
                @selectionUpdate="captureSelectionUpdate"
              />
            </div>
          </v-tab-item>
        </v-tabs-items>

        <v-row ref="searchbtn" dense :justify="'end'">
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
    tableHeight: 100,
  }),
  computed: {
    ...mapState("services", ["searchInput"]),
    isLoadingComplete: function () {
      return this.active.owner != null && this.active.policy != null;
    },
  },
  mounted() {
    this.calcHeight();
  },
  methods: {
    setSearchParams() {
      this.cluster = this.getFiltersFromUrl(this.cluster, true);
    },
    changeTab(num) {
      this.cluster.tabname = this.tabnames[num];
    },
    calcHeight() {
      let tabheight =
        window.innerHeight -
        this.$refs.networkselection.getBoundingClientRect().top -
        this.$refs.searchbtn.clientHeight -40;
      this.tableHeight = tabheight;
    },
    searchUpdate() {
      let me = this;
      this.$emit("closeSearch");
      this.$store.commit("services/SET_LOADING_CIRCLE", true);
      this.emitSearchInputToParent();

      this.$store.dispatch("services/loadPlainSearch").then((cbdata) => {
        window.location.hash = "";
        me.updateUrlHash(cbdata);
      });

      this.$emit("changeBadgeVal", this.search_networks);
      this.$store.dispatch("services/getServicesList");
    },
    captureSelectionUpdate(data) {
      this.search_networks = data;
    },
    emitSearchInputToParent() {
      this.$store.commit("services/SET_NETWORK_SELECTION", {
        search_networks: this.search_networks,
      });
    },
  },
};
</script>