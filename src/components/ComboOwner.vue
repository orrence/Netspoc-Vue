<template>
<v-flex xs2>
  <v-combobox
    v-model="select"
    :items="owners"
  ></v-combobox>
</v-flex>
</template>

<script>
export default {
  name: 'combo-owner',
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
    this.$store.dispatch('getOwners');
    this.$store.dispatch('getActiveOwner');
  }
}
</script>