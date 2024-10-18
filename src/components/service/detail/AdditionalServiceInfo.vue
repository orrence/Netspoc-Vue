<template>
  <v-row dense ref="additionalfilter">
    <v-col>
      <v-row class="ma-2" dense :justify="'start'">
        <v-col :cols="disable_at != '' ? 8 : 12">
          <v-text-field :value="name" label="Name" dense outlined readonly />
        </v-col>
        <v-col v-if="disable_at != ''" cols="4">
          <v-text-field :value="disable_at" label="Befristet bis:" dense outlined readonly />
        </v-col>
      </v-row>
      <v-row class="mx-2" dense :justify="'start'">
        <v-col :cols="disabled != '' ? 8 : 12">
          <v-text-field :value="description" label="Beschreibung" dense outlined readonly />
        </v-col>
        <v-col v-if="disabled != ''" cols="4">
          <v-text-field value="Disabled" label="Status:" dense outlined readonly />
        </v-col>
      </v-row>
      <v-row class="mx-2" dense :justify="'start'">
        <v-col v-if="items.length > 1" cols="12">
          <v-overflow-btn @change="onChangeResponsible" class="my-0 switchresponse_btn" :items="items"
            v-model="selected" autoSelectFirst filled dense outlined></v-overflow-btn>
        </v-col>
        <v-col v-else cols="12">
          <v-text-field :value="owner" label="Verantwortung" dense outlined readonly />
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
    items: [],
    selected: null,
  }),
  computed: {
    ...mapState("services", ["serviceSelection"]),
  },
  watch: {
    serviceSelection: function () {
      let me = this;
      if (this.serviceSelection.length > 0) {
        this.name = this.serviceSelection[0].name;
        this.description = this.serviceSelection[0].description;

        this.items = [];
        this.serviceSelection[0].owner.forEach(element => {
          me.items.push(element.name)
        });

        this.owner = this.serviceSelection[0].owner[0].name;
        this.selected = this.serviceSelection[0].owner[0].name;
        this.disabled = this.serviceSelection[0].disabled
          ? this.serviceSelection[0].disabled
          : "";
        this.disable_at = this.serviceSelection[0].disable_at
          ? this.serviceSelection[0].disable_at
          : "";
      } else {
        this.name = "";
        this.description = "";
        this.owner = "";
        this.disabled = "";
        this.disable_at = "";
      }
    },
  },
  methods: {
    onChangeResponsible(item) {
      let me = this;
      this.selected = item;
      this.$store
        .dispatch("services/getAdminsData", item)
        .then((response) => {

          me.$store.dispatch('services/setRulesAdminsData', response.data.records)
        });
    }
  }
};
</script>