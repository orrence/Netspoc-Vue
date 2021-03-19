<template>
  <div id="searchbar">
    <v-row dense>
      <v-col>
        <v-container fluid>
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
                    v-model="search_ip1"
                    id="txtf_search_ip1"
                    color="orange"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    label="IP 2"
                    v-model="search_ip2"
                    id="txtf_search_ip2"
                    color="orange"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    label="Protokoll"
                    v-model="search_proto"
                    id="txtf_search_proto"
                    color="orange"
                  />
                </v-col>
              </v-row>

              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    id="cb_search_supernet"
                    v-model="search_supernet"
                    label="Übergeordnete Netze einbeziehen"
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox
                    id="cb_search_subnet"
                    v-model="search_subnet"
                    label="Enthaltene Netze einbeziehen"
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox
                    id="cb_search_range"
                    v-model="search_range"
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
                    v-model="search_string"
                    id="search_string"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-checkbox
                    v-model="search_in_desc"
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
                    v-model="search_own"
                    label="Eigene"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    id="cb_search_used"
                    class="mt-0"
                    v-model="search_used"
                    label="Genutzte"
                  />
                </v-col>
              </v-row>

              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    class="mt-0"
                    id="cb_search_usable"
                    v-model="search_visible"
                    label="Nutzbare"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    class="mt-0"
                    id="cb_search_limited"
                    v-model="search_limited"
                    label="Nur befristete Dienste suchen"
                  />
                </v-col>
              </v-row>
              <v-divider />
              <v-subheader class="body-1 pl-0">Allgemeine Optionen</v-subheader>
              <v-row dense :align="'center'">
                <v-col>
                  <v-checkbox
                    v-model="search_case_sensitive"
                    id="cb_search_case_sensitive"
                    label="Groß-/Kleinschreibung beachten"
                    class="mt-0"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    v-model="search_exact"
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
    tabsearchArea: 0,
  }),
  computed: {
    ...mapState("services", ["searchInput"]),

    search_ip1: {
      set(search_ip1) {
        this.$store.commit("services/SEARCH_UPDATE_RULES", { search_ip1 });
      },
      get() {
        return this.searchInput.rules.search_ip1;
      },
    },
    search_ip2: {
      set(search_ip2) {
        this.$store.commit("services/SEARCH_UPDATE_RULES", { search_ip2 });
      },
      get() {
        return this.searchInput.rules.search_ip2;
      },
    },
    search_proto: {
      set(search_proto) {
        this.$store.commit("services/SEARCH_UPDATE_RULES", { search_proto });
      },
      get() {
        return this.searchInput.rules.search_proto;
      },
    },
    search_supernet: {
      set(search_supernet) {
        this.$store.commit("services/SEARCH_UPDATE_RULES", { search_supernet });
      },
      get() {
        return this.searchInput.rules.search_supernet;
      },
    },
    search_subnet: {
      set(search_subnet) {
        this.$store.commit("services/SEARCH_UPDATE_RULES", { search_subnet });
      },
      get() {
        return this.searchInput.rules.search_subnet;
      },
    },
    search_range: {
      set(search_range) {
        this.$store.commit("services/SEARCH_UPDATE_RULES", { search_range });
      },
      get() {
        return this.searchInput.rules.search_range;
      },
    },
    search_string: {
      set(search_string) {
        this.$store.commit("services/SEARCH_UPDATE_TEXTSEARCH", {
          search_string,
        });
      },
      get() {
        return this.searchInput.textsearch.search_string;
      },
    },
    search_in_desc: {
      set(search_in_desc) {
        this.$store.commit("services/SEARCH_UPDATE_TEXTSEARCH", {
          search_in_desc,
        });
      },
      get() {
        return this.searchInput.textsearch.search_in_desc;
      },
    },
    search_own: {
      set(search_own) {
        this.$store.commit("services/SEARCH_UPDATE_GENERAL", { search_own });
      },
      get() {
        return this.searchInput.general.search_own;
      },
    },
    search_used: {
      set(search_used) {
        this.$store.commit("services/SEARCH_UPDATE_GENERAL", { search_used });
      },
      get() {
        return this.searchInput.general.search_used;
      },
    },
    search_visible: {
      set(search_visible) {
        this.$store.commit("services/SEARCH_UPDATE_GENERAL", {
          search_visible,
        });
      },
      get() {
        return this.searchInput.general.search_visible;
      },
    },
    search_limited: {
      set(search_limited) {
        this.$store.commit("services/SEARCH_UPDATE_GENERAL", {
          search_limited,
        });
      },
      get() {
        return this.searchInput.general.search_limited;
      },
    },
    search_case_sensitive: {
      set(search_case_sensitive) {
        this.$store.commit("services/SEARCH_UPDATE_GENERAL", {
          search_case_sensitive,
        });
      },
      get() {
        return this.searchInput.general.search_case_sensitive;
      },
    },
    search_exact: {
      set(search_exact) {
        this.$store.commit("services/SEARCH_UPDATE_GENERAL", { search_exact });
      },
      get() {
        return this.searchInput.general.search_exact;
      },
    },
  },
  mounted() {
    if (this.$route.hash != "") {
      if (this.searchInput.rules.search_string != undefined) {
        this.tabsearchArea = 1;
      } else {
        this.tabsearchArea = 0;
      }
    }
  },
  methods: {
    searchUpdate() {
      let me = this;
      this.$store.commit("services/SET_LOADING_CIRCLE", true);
      if (this.tabsearchArea == 0) {
        this.search_string = "";
      } else {
        this.search_ip1 = "";
        this.search_ip2 = "";
        this.search_proto = "";
      }

      this.$store.dispatch("services/loadPlainSearch").then((cbdata) => {
        window.location.hash = "";
        me.updateUrlHash(cbdata);
      });

      this.$emit("closeSearch");
      this.$store.commit("services/UPDATE_SERVICE_TAB_NUMBER", 3);
      this.$store.dispatch("services/getServicesList");
    },
  },
};
</script>