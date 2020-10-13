<template>
  <v-container fluid>
    <v-btn
      tile
      elevation="2"
      class="ma-4 ml-0"
      raised
      color="secondary"
      @click.stop="openNavDrawer('search')"
    >
      <v-icon left>mdi-search-web</v-icon>Suchen
    </v-btn>
    <div style="display: inline-flex">
      <v-badge color="green" overlap offset-x="26" offset-y="24" :value="message" :content="message">
        <v-btn
          tile
          elevation="2"
          class="ma-4 ml-0"
          raised
          color="secondary"
          @click.stop="openNavDrawer('netselection')"
        >
          <v-icon left>mdi-search-web</v-icon>Netzauswahl
        </v-btn>
      </v-badge>
    </div>

    <v-navigation-drawer v-model="drawer" absolute temporary width="500">
      <search-bar v-if="showsearchbar" @closeSearch="drawer = !drawer" />
      <netselection-bar v-else @closeSearch="drawer = !drawer"  @changeBadgeVal="toggleBatchValue" />
    </v-navigation-drawer>

    <v-row dense>
      <v-col cols="4">
        <service-tabs
          class="mr-2"
          :serviceTab="tab_services"
          @selectionUpdate="captureSelectionUpdate"
        />
      </v-col>

      <v-col cols="8">
        <service-detail-tabs class="ml-2" :search_input="searchInput" :tab_services="tab_services" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ServiceTabs from "../components/service/ServiceTabs";
import ServiceDetailTabs from "../components/service/detail/ServiceDetailTabs";
import SearchBar from "../components/service/search/SearchBar";
import NetselectionBar from "../components/service/search/NetselectionBar";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    SearchBar,
    ServiceTabs,
    ServiceDetailTabs,
    NetselectionBar,
  },
  data: () => ({
    pnl_search: 0,
    tab_services: -1,
    drawer: false,
    admins: {},
    showsearchbar: true,
    message: 0,
  }),
  computed: {
    ...mapState("services", ["searchInput", "serviceSelection"]),
  },
  mounted() {
    if (this.$route.hash == "") {
      this.tab_services = 0;
    } else {
      this.tab_services = 3;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  watch: {
    tab_services: {
      handler() {
        this.updateServiceSelection([]);
      },
    },
    searchInput: {
      deep: true,
      handler() {
        console.log("searhc input");
        this.updateServiceSelection([]);
        this.tab_services = 3;
      },
    },
  },
  methods: {
    ...mapActions("services", ["updateServiceSelection"]),
    resize() {
      let elements = this.getElementsByClassName("testitest");
      for (let i = 0; i < elements; i++) {
        elements[i].setAttribute(
          "style",
          "min-height:400px; height:" +
            (window.innerHeight - elements[i].getBoundingClientRect().top) +
            "px;"
        );
      }
    },
    toggleBatchValue(val) {
      console.log('SEACA');
      console.log(this.searchInput);
      this.message = val.length;
    },
    openNavDrawer(type) {
      if (type == "search") {
        this.showsearchbar = true;
      } else {
        this.showsearchbar = false;
      }
      this.drawer = !this.drawer;
    },

    getElementsByClassName(className) {
      if (document.getElementsByClassName) {
        return document.getElementsByClassName(className);
      } else {
        return document.querySelectorAll("." + className);
      }
    },
    recieveSearchInput(newInput) {
      this.search_input = newInput;
    },

    captureSelectionUpdate(data) {
      console.log("UPDATE SELCTION DATA " + data);
      this.tab_services = data;
    },
  },
};
</script>

<style>
.testitest {
  /*min-height: 600px;*/
  /*height: 100%;*/
}
</style>
