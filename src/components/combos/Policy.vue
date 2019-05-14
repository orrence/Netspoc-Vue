<template>
<v-flex xs2 v-if="loaded">
  <v-combobox
    label="Policy"
    v-model="activePolicy"
    :items="policies"
    item-text="date"
    return-object
    full-width
    box
    background-color="grey darken-3"
    color="orange"
  ></v-combobox>
</v-flex>
</template>

<script>
export default {
  name: 'combo-policy',
  data: () => ({
    loaded: false
  }),
  computed: {
    policies () {
      return this.$store.state.history;
    },
    activePolicy: {
      get () {
        return this.$store.state.activePolicy;   
      },
      set (newValue) {
        this.$store.commit('setActivePolicy', newValue);
      }
    }
  },
  mounted () {
    this.$store.dispatch('getActiveOwner')
      .then(() => {
        this.$store.dispatch('getHistory')
        .then(() => {
          this.loaded = true;
          if (!this.activePolicy) {
            this.activePolicy = this.policies[0];
          }
        }); 
      });
  },
  methods:  {
  }
}
</script>