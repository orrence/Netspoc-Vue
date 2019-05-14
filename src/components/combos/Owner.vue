<template>
<v-flex xs2 v-if="loadedOwner && loadedActiveOwner">
  <v-combobox
    label="Owner"
    v-model="select"
    :items="owners"
    full-width
    box
    background-color="grey darken-3"
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
      get () {
        return this.$store.state.activeOwner;
      },
      set (newValue) {
        this.$store.dispatch('setActiveOwner', newValue);
      }
    },
    owners: {
      get () {
        return this.$store.state.owners;
      }
    }
  },
  mounted () {
    this.$store.dispatch('getOwners')
      .then(() => {
        this.loadedOwner = true;
      });
    this.$store.dispatch('getActiveOwner')
      .then(() => {
        this.loadedActiveOwner = true;
      });
  }
}
</script>