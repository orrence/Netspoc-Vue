<template>
  <v-card tile class="fill-height" elevation="1" v-if="appLoaded">
    <v-tabs
      @change="onChangeTab"
      background-color="lightgray"
      v-model="tab_details"
      slider-color="orange"
    >
      <v-tab>Details zum Dienst</v-tab>
      <v-tab>Benutzer (User) des Dienstes</v-tab>
    </v-tabs>

    <additional-filter-options
      :expandUser="expandUser"
      @expandUserChanged="expandUser = $event"
      :tab_details="tab_details"
      :IPAsName="IPAsName"
      @IPAsNameChanged="IPAsName = $event"
      :filterBySearch="filterBySearch"
      @filterBySearchChanged="filterBySearch = $event"
    />

    
    <v-tabs-items v-model="tab_details">
      <v-tab-item :key="0">
        <service-rules-table
          :expandUser="expandUser"
          :IPAsName="IPAsName"
          :filterBySearch="filterBySearch && serviceTabNumber === 3"
          :search_input="searchInput"
        />
      </v-tab-item>
      <v-tab-item :key="1">
        <service-users-table :filterBySearch="filterBySearch" />
      </v-tab-item>
    </v-tabs-items>

    <AdminsTable
      v-if="serviceSelection.length < 2"
      :selection="serviceSelection"
      :activetab="tab_details"
    />
  </v-card>
</template>

<script>
import ServiceUsersTable from "../../tables/Service/ServiceUsersTable";
import AdminsTable from "../../tables/AdminsTable";
import ServiceRulesTable from "../../tables/Service/ServiceRulesTable";
import AdditionalFilterOptions from "./AdditionalFilterOptions";

import { mapState, mapGetters } from "vuex";

export default {
  components: {
    ServiceUsersTable,
    AdminsTable,
    ServiceRulesTable,
    AdditionalFilterOptions,
    
  },
  data: () => ({
    pnl_search: 0,
    tab_details: 0,
    expandUser: false,
    IPAsName: false,
    filterBySearch: true,
    admins: {},
  }),

  computed: {
    ...mapState("services", [
      "searchInput",
      "serviceSelection",
      "serviceTabNumber",
    ]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
    appLoaded: function() {
      return this.$store.getters['auth/getLoggedIn'];
    }
  },

  methods: {
    onChangeTab(data) {
      if (data == 0) {
        this.$store.dispatch("services/getAdminsData", "");
      }
    },
  },
};
</script>