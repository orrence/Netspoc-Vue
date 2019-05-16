<template>
<v-flex xs2>
  <v-combobox
    label="Policy"
    v-model="policy"
    :items="history"
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
import { mapState } from 'vuex';
export default {
  name: 'combo-policy',
  computed: {
    ...mapState({ history: 'history' }),
    policy: {
      get () { return this.$store.state.active.policy; },
      set (val) { this.$store.commit('setActivePolicy', val); }
    }
  }
}
</script>