<template>
  <v-row dense ref="additionalfilter">
    <v-col>
      <v-row class="ma-2" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field :value="name" label="Name" dense outlined readonly />
        </v-col>
      </v-row>
      <v-row class="mx-2" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field
            :value="description"
            label="Beschreibung"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row class="mx-2" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field
            :value="owner"
            label="Verantwortung"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row class="mx-2" v-if="disable_at != ''" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field
            :value="disable_at"
            label="Befristet bis:"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row class="mx-2" v-if="disabled != ''" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field
            value="Disabled"
            label="Status:"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    name: "",
    description: "",
    disable_at: "",
    disabled: "",
    owner: "",
  }),
  computed: {
    ...mapState("services", ["serviceSelection"]),
  },
  watch: {
    serviceSelection: function () {
      console.log('SERVICES IS ', this.serviceSelection);
      if (this.serviceSelection.length > 0) {
        this.name = this.serviceSelection[0].name;
        this.description = this.serviceSelection[0].description;
        this.owner = this.serviceSelection[0].owner.map(owner => owner.name).join(', ');
        this.disabled = this.serviceSelection[0].disabled ? this.serviceSelection[0].disabled : '';
        this.disable_at = this.serviceSelection[0].disable_at ? this.serviceSelection[0].disable_at : '';

      } else {
        this.name = '';
        this.description = '';
        this.owner = '';
        this.disabled = '';
        this.disable_at = '';
      }
    },
  },
};
</script>