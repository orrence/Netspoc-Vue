<template>
<v-flex xs5 v-if="loadedOwner && loadedActiveOwner">
  <v-combobox
    label="Owner"
    v-model="select"
    :items="owners"
    filled
    color="orange"
  ></v-combobox>
</v-flex>
</template>

<script>
export default {
  name: 'combo-owner',
  data: () => ({
    loadedOwner: false,
    loadedActiveOwner: false
  }),
  computed: {
    select: {
      get () { return this.$store.state.active.owner; },
      set (val) { this.$store.dispatch('setActive', val); }
    },
    owners: {
      get () { return this.$store.state.owners; }
    }
  },
  mounted () {
    this.$store.dispatch('getOwners')
      .then(() => {
        this.loadedOwner = true;
      });
    this.$store.dispatch('getActive')
      .then(() => {
        this.loadedActiveOwner = true;
      });
  }
}
</script>

<style>
/* remove unwanted margins made by vuetify */
.v-select-list .v-list .v-input__slot { 
  margin-bottom: 0 !important;
  margin-top: 20;
}
</style>