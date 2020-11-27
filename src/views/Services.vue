<template>
  <v-container fluid>
    <v-btn
      elevation="2"
      class="ma-4 ml-0"
      raised
      id="btn_open_search"
      color="secondary"
      @click.stop="openNavDrawer('search')"
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
          class="ma-4 ml-0"
          raised
          color="secondary"
          @click.stop="openNavDrawer('netselection')"
        >
          <v-icon left>mdi-search-web</v-icon>Netzauswahl
        </v-btn>
      </v-badge>
    </div>
    <v-btn
      elevation="2"
      raised
      
      @click.stop="clearSearchFilter()"
    >
      <v-icon left>mdi-search-web</v-icon>Filter zurücksetzen</v-btn
    >

    <v-navigation-drawer v-model="drawer" absolute temporary width="500">
      <search-bar @closeSearch="drawer = !drawer" />
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="netselectiondrawer"
      absolute
      temporary
      width="500"
    >
      <netselection-bar
        @closeSearch="netselectiondrawer = !netselectiondrawer"
        @changeBadgeVal="toggleBatchValue"
      />
    </v-navigation-drawer>

    <v-row dense>
      <v-col cols="4">
        <service-tabs class="mr-2" />
      </v-col>
      <v-col cols="8">
        <service-detail-tabs class="ml-2" :search_input="searchInput" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ServiceTabs from "../components/service/ServiceTabs";
import ServiceDetailTabs from "../components/service/detail/ServiceDetailTabs";
import SearchBar from "../components/service/search/SearchBar";
import NetselectionBar from "../components/service/search/NetselectionBar";
import { mapState } from "vuex";
import urlSearchParams from "../components/mixins/urlSearchParams";
import EventBus from "../plugins/event-bus";

export default {
  mixins: [urlSearchParams],
  components: {
    SearchBar,
    ServiceTabs,
    ServiceDetailTabs,
    NetselectionBar,
  },
  data: () => ({
    pnl_search: 0,
    drawer: false,
    netselectiondrawer: false,
    admins: {},
    showsearchbar: true,
    networkCount: 0,
  }),
  computed: {
    ...mapState("services", ["searchInput", "serviceTabNumber"]),
  },
  mounted() {
    if (this.$route.hash == "") {
      this.$store.commit("services/UPDATE_SERVICE_TAB_NUMBER", 0);
    } else {
      let filters = this.getFiltersFromUrl(
        this.$store.getters["services/getsearchInputPlain"],
        true
      );

      this.networkCount = filters.search_networks.length;

      this.$store.commit("services/UPDATE_SERVICE_TAB_NUMBER", 3);
    }
  },
  methods: {
    toggleBatchValue(val) {
      this.networkCount = val.length;
    },
    openNavDrawer(type) {
      if (type == "search") {
        this.drawer = !this.drawer;
      } else {
        this.netselectiondrawer = !this.netselectiondrawer;
      }
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
    clearSearchFilter() {
       this.$store.commit("services/SET_LOADING_CIRCLE", true);
       EventBus.$emit("selectionUpdated", "start");

       window.location.hash = '';
    }
  },
};
</script>
