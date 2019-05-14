<template>
<v-flex>
  <v-combobox
    label="Policy (old)"
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
export default {
  name: 'combo-policy-compare',
  props: {
    history: {
      type: Array,
      required: true
    },
    updateFunc: {
      type: Function,
      required: true
    }
  },
  data: () => ({
  }),
  computed: {
    policy: {
      get () {
        return null;
      },
      set (value) {
        this.updateFunc(value);
      }
    }
  }
}
</script>