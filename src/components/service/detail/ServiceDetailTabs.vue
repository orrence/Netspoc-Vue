<template>
  <v-card tile>
    <v-tabs background-color="lightgray" v-model="tab_details" slider-color="orange">
      <v-tab>Details zum Dienst</v-tab>
      <v-tab>Benutzer (User) des Dienstes</v-tab>
    </v-tabs>

    <additional-filter-options
      :expandUser="expandUser"
      @expandUserChanged="expandUser = $event"
      :tab_details="tab_details"
      :IPAsName="IPAsName"
      @IPAsNameChanged="IPAsName = $event"
      :tab_services="tab_services"
      :filterBySearch="filterBySearch"
      @filterBySearchChanged="filterBySearch = $event"
    />

    <additional-service-info v-if="serviceSelection.length == 1" :serviceSelection="serviceSelection" />

    <v-tabs-items v-model="tab_details">
      <v-tab-item :key="0">
        <service-rules-table
          :selection="serviceSelection"
          :expandUser="expandUser"
          :IPAsName="IPAsName"
          :filterBySearch="filterBySearch && tab_services===3"
          :search_input="searchInput"
        />
      </v-tab-item>
      <v-tab-item :key="1">
        <service-users-table :filterBySearch="filterBySearch" :selection="serviceSelection" />
      </v-tab-item>
    </v-tabs-items>

    <AdminsTable v-if="serviceSelection.length < 2" :selection="serviceSelection" />
  </v-card>
</template>

<script>
import ServiceUsersTable from "../../tables/Service/ServiceUsersTable";
import AdminsTable from "../../tables/AdminsTable";
import ServiceRulesTable from "../../tables/Service/ServiceRulesTable";
import AdditionalFilterOptions from "./AdditionalFilterOptions";
import AdditionalServiceInfo from "./AdditionalServiceInfo";

import { mapState } from "vuex";

export default {
  props: ["tab_services"],
  components: {
    ServiceUsersTable,
    AdminsTable,
    ServiceRulesTable,
    AdditionalFilterOptions,
    AdditionalServiceInfo
  },
  watch: {
    serviceSelection: {
      handler() {
        console.log('DETAIL SERVICE UPDATED');
        console.log(this.serviceSelection);
      }
    }
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
    ...mapState("services", ["searchInput", "serviceSelection"]),
  },
};
</script>