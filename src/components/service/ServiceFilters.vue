<template>
  <div class="flex">
    <v-btn
      elevation="2"
      class="mr-4 ml-0"
      raised
      id="btn_open_search"
      color="secondary"
      @click.stop="openNav('search')"
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
          class="mr-4 ml-0"
          raised
          color="secondary"
          @click.stop="openNav('netselection')"
        >
          <v-icon left>mdi-search-web</v-icon>Netzauswahl
        </v-btn>
      </v-badge>
    </div>
    <v-btn elevation="2" raised @click.stop="clearFilter()">
        <v-icon left>mdi-search-web</v-icon>Filter zurücksetzen</v-btn
      >
  </div>
</template>

<script>
export default {
  props: {
		networkCount: {
			required: true
		}
	},
  methods: {
    openNav(type) {
      this.$emit("openNavDrawer", type);
    },
    clearFilter() {
      this.$emit("clearSearchFilter");
    }
  },
};
</script>