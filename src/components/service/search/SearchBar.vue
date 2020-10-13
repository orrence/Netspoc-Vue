<template>
  <v-row dense>
    <v-col>
      <v-container fluid>
        <v-tabs
          background-color="lightgray"
          v-model="cluster.tab_search"
          @change="changeTab"
          slider-color="orange"
          grow
        >
          <v-tab>Regeln</v-tab>
          <v-tab>Beschreibung</v-tab>
        </v-tabs>
        <v-tabs-items v-model="cluster.tab_search">
          <v-tab-item>
            <v-subheader class="body-1 pl-0">Wonach soll gesucht werden?</v-subheader>
            <v-row dense>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="IP 1"
                  v-model="cluster.search_ip1"
                  id="txtf_search_ip1"
                  color="orange"
                />
              </v-col>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="IP 2"
                  v-model="cluster.search_ip2"
                  id="txtf_search_ip2"
                  color="orange"
                />
              </v-col>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Protokoll"
                  v-model="cluster.search_proto"
                  id="txtf_search_proto"
                  color="orange"
                />
              </v-col>
            </v-row>

            <v-row dense :align="'center'">
              <v-col>
                <v-checkbox
                  v-model="cluster.search_supernet"
                  label="Übergeordnete Netze einbeziehen"
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox v-model="cluster.search_subnet" label="Enthaltene Netze einbeziehen"></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
              
                  v-model="cluster.search_range"
                  label="Port-Ranges einbeziehen"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-tab-item>

          <v-tab-item>
            <v-subheader>Suchbegriff</v-subheader>
            <v-row dense>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Suchbegriff"
                  v-model="cluster.search_string"
                  id="search_string"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-checkbox
                  v-model="cluster.search_description"
                  label="Suche auch in Dienstbeschreibungen"
                />
              </v-col>
            </v-row>
          </v-tab-item>

        </v-tabs-items>

        <v-divider />

        <v-row dense :align="'center'">
          <v-col>
            <v-subheader class="body-1 pl-0">In welchen Diensten suchen?</v-subheader>
            <v-row dense :align="'center'">
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.search_own" label="Eigene" />
              </v-col>
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.search_used" label="Genutzte" />
              </v-col>
            </v-row>

           
            <v-row dense :align="'center'">
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.search_visible" label="Nutzbare" />
              </v-col>
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.search_limited" label="Nur befristete Dienste suchen" />
              </v-col>
            </v-row>
             <v-divider />
            <v-subheader class="body-1 pl-0">Allgemeine Optionen</v-subheader>
            <v-row dense :align="'center'">
              <v-col>
                <v-checkbox
                  v-model="cluster.search_case_sensitive"
                  label="Groß-/Kleinschreibung beachten"
                  class="mt-0"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="cluster.search_exact"
                  label="Suchergebnisse nur mit exakter Übereinstimmung"
                  class="mt-0"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row dense :justify="'end'">
          <v-col>
            <v-btn block color="success" @click="searchUpdate">suchen</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import urlSearchParams from "../../mixins/urlSearchParams";
import EventBus from '../../../plugins/event-bus';
import { mapState } from "vuex";

export default {
  mixins: [urlSearchParams],

  data: () => ({
    url: "http://localhost/?#/services/0",
    tabnames: ["regeln", "beschreibung"],
    cluster: {}
  }),
  computed: {
      ...mapState("services", ["searchInput"]),
  },
  mounted() {
    this.cluster = this.searchInput;
    console.log('CLUSTER LOAD');
    console.log(this.cluster);
    if (this.$route.hash != "") {
      this.setSearchParams();
      if (this.cluster.search_string) {
        this.cluster.tab_search = 0;
      } else {
        this.cluster.tab_search = 1;
      }
      this.emitSearchInputToParent();
    }
  },
  beforeRouteUpdate() {
    console.log("ROUTE CHANGE");
    if (this.$route.hash != "") {
      this.setSearchParams();
      if (this.cluster.search_string) {
        this.cluster.tab_search = 0;
      } else {
        this.cluster.tab_search = 1;
      }
    }
  },
  methods: {
    setSearchParams() {
      this.cluster = this.getFiltersFromUrl(this.searchInput, true);
    },
    changeTab(num) {
      this.cluster.tabname = this.tabnames[num];
    },

    searchUpdate() {
  
      this.$emit("closeSearch");
      this.updateUrlHash(this.searchInput);
      this.emitSearchInputToParent();
      EventBus.$emit('showsearchresults');
    },
    captureSelectionUpdate(data) {
      this.cluster.search_networks = data;
    },
    emitSearchInputToParent() {
      this.$store.commit("services/SEARCH_UPDATE", this.cluster);
    },
  },
};
</script>