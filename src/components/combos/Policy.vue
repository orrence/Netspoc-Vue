<template>
<v-flex xs5>
  <v-combobox
    id="combo_policy"
    label="Policy"
    v-model="policy"
    :items="history"
    item-text="date"
    return-object
    filled
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
