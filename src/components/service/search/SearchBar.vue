<template>
  <v-row dense>
    <v-col>
      <v-container fluid v-if="Object.keys(cluster).length > 0">
        <v-tabs
          background-color="lightgray"
          v-model="tabsearchArea"
          @change="changeTab"
          slider-color="orange"
          grow
        >
          <v-tab>Regeln</v-tab>
          <v-tab>Beschreibung</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabsearchArea">
          <v-tab-item :key="0">
            <v-subheader class="body-1 pl-0">Wonach soll gesucht werden?</v-subheader>
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
                  v-model="cluster.rules.search_supernet"
                  label="Übergeordnete Netze einbeziehen"
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox v-model="cluster.search_subnet" label="Enthaltene Netze einbeziehen"></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
              
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
                  v-model="cluster.textsearch.search_description"
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
                <v-checkbox class="mt-0" v-model="cluster.general.search_own" label="Eigene" />
              </v-col>
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.general.search_used" label="Genutzte" />
              </v-col>
            </v-row>

           
            <v-row dense :align="'center'">
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.general.search_visible" label="Nutzbare" />
              </v-col>
              <v-col>
                <v-checkbox class="mt-0" v-model="cluster.general.search_limited" label="Nur befristete Dienste suchen" />
              </v-col>
            </v-row>
             <v-divider />
            <v-subheader class="body-1 pl-0">Allgemeine Optionen</v-subheader>
            <v-row dense :align="'center'">
              <v-col>
                <v-checkbox
                  v-model="cluster.general.search_case_sensitive"
                  label="Groß-/Kleinschreibung beachten"
                  class="mt-0"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="cluster.general.search_exact"
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
    tabnames: ["regeln", "beschreibung"],
    cluster: {},
    tabsearchArea: 0,
  }),
  computed: {
      ...mapState("services", ["searchInput","searchArea"]),
  },
  mounted() {
    if (this.$route.hash != "") {
      this.setSearchParams();
    
      if (this.cluster.rules.search_string != '') {
        this.tabsearchArea= 1;
      } else {
        this.tabsearchArea = 0;
      }
     
    } else {
      this.cluster = this.searchInput;
    }
  },
  beforeRouteUpdate() {
   
    if (this.$route.hash != "") {
      this.setSearchParams();
      if (this.cluster.rules.search_string != '') {
        this.tabsearchArea = 1;
      } else {
        this.tabsearchArea = 0;
      }
    }
  },
  methods: {
    setSearchParams() {
      let filters = this.getFiltersFromUrl(this.$store.getters['services/getsearchInputPlain'], true);
  
      this.$store.commit('services/UPDATE_SEARCH_FROM_URLHASH',filters);
      this.cluster = this.searchInput;
    
    },
    changeTab(num) {
    
      this.$store.commit('services/UPDATE_SEARCH_AREA',this.tabnames[num]);
    },

    searchUpdate() {
  
      this.$emit("closeSearch");
      this.updateUrlHash(this.$store.getters['services/getsearchInputPlain']);
      this.emitSearchInputToParent();
      EventBus.$emit('selectionUpdated','search');
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