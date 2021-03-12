<template>
  <div id="searchbar">
    <v-row dense>
      <v-col>
        <v-container fluid v-if="Object.keys(cluster).length > 0">
          <v-tabs
            background-color="lightgray"
            v-model="tabsearchArea"
            slider-color="orange"
            grow
          >
            <v-tab>Regeln</v-tab>
            <v-tab>Beschreibung</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabsearchArea">
            <v-tab-item :key="0">
              <v-subheader class="body-1 pl-0"
                >Wonach soll gesucht werden?</v-subheader
              >
              <v-row dense>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    label="IP 1"
                    v-model="cluster.rules.search_ip1"
                    id="txtf_search_ip1"
                    color="orange"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    label="IP 2"
                    v-model="cluster.rules.search_ip2"
                    id="txtf_search_ip2"
                    color="orange"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    label="Protokoll"
                    v-model="cluster.rules.search_proto"
                    id="txtf_search_proto"
                    color="orange"
                  />
                </v-col>
              </v-row>

              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    id="cb_search_supernet"
                    v-model="cluster.rules.search_supernet"
                    label="Übergeordnete Netze einbeziehen"
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox
                    id="cb_search_subnet"
                    v-model="cluster.search_subnet"
                    label="Enthaltene Netze einbeziehen"
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox
                    id="cb_search_range"
                    v-model="cluster.rules.search_range"
                    label="Port-Ranges einbeziehen"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-tab-item>

            <v-tab-item :key="1">
              <v-subheader>Suchbegriff</v-subheader>
              <v-row dense>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    label="Suchbegriff"
                    v-model="cluster.textsearch.search_string"
                    id="search_string"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-checkbox
                    v-model="cluster.textsearch.search_in_desc"
                    id="cb_search_description"
                    label="Suche auch in Dienstbeschreibungen"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>

          <v-divider />

          <v-row dense :align="'center'">
            <v-col>
              <v-subheader class="body-1 pl-0"
                >In welchen Diensten suchen?</v-subheader
              >
              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    class="mt-0"
                    id="cb_search_own"
                    v-model="cluster.general.search_own"
                    label="Eigene"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    id="cb_search_used"
                    class="mt-0"
                    v-model="cluster.general.search_used"
                    label="Genutzte"
                  />
                </v-col>
              </v-row>

              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    class="mt-0"
                    id="cb_search_usable"
                    v-model="cluster.general.search_visible"
                    label="Nutzbare"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    class="mt-0"
                    id="cb_search_limited"
                    v-model="cluster.general.search_limited"
                    label="Nur befristete Dienste suchen"
                  />
                </v-col>
              </v-row>
              <v-divider />
              <v-subheader class="body-1 pl-0">Allgemeine Optionen</v-subheader>
              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    v-model="cluster.general.search_case_sensitive"
                    id="cb_search_case_sensitive"
                    label="Groß-/Kleinschreibung beachten"
                    class="mt-0"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    v-model="cluster.general.search_exact"
                    id="cb_search_exact"
                    label="Suchergebnisse nur mit exakter Übereinstimmung"
                    class="mt-0"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row dense :justify="'end'">
            <v-col>
              <v-btn
                block
                color="success"
                id="btn_search_start"
                @click="searchUpdate"
                >suchen</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import urlSearchParams from "../../mixins/urlSearchParams";
import { mapState } from "vuex";

export default {
  mixins: [urlSearchParams],

  data: () => ({
    tabnames: ["regeln", "beschreibung"],
    cluster: {},
    tabsearchArea: 0,
  }),
  computed: {
    ...mapState("services", ["searchInput"]),
  },
  mounted() {
    console.log("ROUTE HASH IS ", this.searchInput);
    if (this.$route.hash != "") {
      // this.setSearchParams();
      this.cluster = this.searchInput;
      if (this.cluster.rules.search_string != "") {
        this.tabsearchArea = 1;
      } else {
        this.tabsearchArea = 0;
      }
    } else {
      this.cluster = this.searchInput;
    }
  },
  beforeRouteUpdate() {
    console.log("ROUTE IS UPDATING");
    if (this.$route.hash != "") {
      this.setSearchParams();
      if (this.cluster.rules.search_string != "") {
        this.tabsearchArea = 1;
      } else {
        this.tabsearchArea = 0;
      }
    }
  },
  methods: {
    setSearchParams() {
      let filters = this.getFiltersFromUrl(
        this.$store.getters["services/getsearchInputPlain"],
        true
      );
      console.log("FILTERS ARE ", filters);

    //  this.$store.commit("services/UPDATE_SEARCH_FROM_URLHASH", filters);
      this.cluster = this.searchInput;
    },

    searchUpdate() {
      this.$emit("closeSearch");
      this.$store.commit("services/SET_LOADING_CIRCLE", true);
      this.$store.commit("services/RESET_SEARCH_STATE");
      if (this.tabsearchArea == 0) {
        this.cluster.textsearch.search_string = "";
      } else {
        this.cluster.rules.search_ip1 = "";
        this.cluster.rules.search_ip2 = "";
        this.cluster.rules.search_proto = "";
      }
      this.$store.commit("services/SEARCH_UPDATE", this.cluster);

      this.updateUrlHash(this.$store.getters["services/getsearchInputPlain"]);

      this.$store.commit("services/UPDATE_SERVICE_TAB_NUMBER", 3);
      this.$store.dispatch("services/getServicesList");
    },
    captureSelectionUpdate(data) {
      this.cluster.search_networks = data;
    },
  },
};
</script>