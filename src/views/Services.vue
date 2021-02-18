<template>
  <div class="flex">
    <div v-if="getActiveLoaded">
      <v-container fluid id="servicefilters">
        <v-row>
          <v-col cols="12">
            <service-filters
              :networkCount="networkCount"
              @clearSearchFilter="clearSearchFilter"
              @openNavDrawer="openNavDrawer"
            />
          </v-col>
        </v-row>
      </v-container>

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

      <v-container fluid class="pt-0">
        <v-row no-gutters class="fill-height">
          <v-col cols="4" class="fill-height">
            <service-tabs class="mr-2" />
          </v-col>
          <v-col cols="8">
            <service-detail-tabs class="ml-2" :search_input="searchInput" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
import ServiceTabs from "../components/service/ServiceTabs";
import ServiceDetailTabs from "../components/service/detail/ServiceDetailTabs";
import SearchBar from "../components/service/search/SearchBar";
import NetselectionBar from "../components/service/search/NetselectionBar";
import { mapGetters, mapState } from "vuex";
import urlSearchParams from "../components/mixins/urlSearchParams";
import EventBus from "../plugins/event-bus";
import ServiceFilters from "../components/service/ServiceFilters.vue";

export default {
  mixins: [urlSearchParams],
  components: {
    SearchBar,
    ServiceTabs,
    ServiceDetailTabs,
    NetselectionBar,
    ServiceFilters,
  },
  data: () => ({
    pnl_search: 0,
    drawer: false,
    netselectiondrawer: false,
    admins: {},
    containerheight: 500,
    showsearchbar: true,
    networkCount: 0,
  }),
  computed: {
    ...mapGetters(["getActiveLoaded"]),
    ...mapState("services", ["searchInput", "serviceTabNumber"]),
  },
  created() {
    window.addEventListener("resize", this.resizeContainer);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeContainer);
  },
  mounted() {
    if (this.$route.hash == "") {
      this.$store.commit("services/UPDATE_SERVICE_TAB_NUMBER", 1);
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
    resizeContainer() {
      let height = document.getElementById("servicefilters").clientHeight;
      this.containerheight = window.innerHeight - 64 - height;
    },
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

      window.location.hash = "";
    },
  },
};
</script>
