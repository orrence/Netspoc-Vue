<template>
  <v-row dense>
    <v-col>
      <v-row class="mx-2" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field
            :value="serviceSelection[0].name"
            label="Name"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row class="mx-2" dense :justify="'start'">
        <v-col cols="12">
          <v-text-field
            :value="serviceSelection[0].description"
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
      <v-row
        class="mx-2"
        v-if="serviceSelection[0].disable_at"
        dense
        :justify="'start'"
      >
        <v-col cols="12">
          <v-text-field
            :value="serviceSelection[0].disable_at"
            label="Befristet bis:"
            dense
            outlined
            readonly
          />
        </v-col>
      </v-row>
      <v-row
        class="mx-2"
        v-if="serviceSelection[0].disabled"
        dense
        :justify="'start'"
      >
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
export default {
  props: ["serviceSelection"],
  computed: {
    owner() {
      let myowner = "";
      this.serviceSelection[0].owner.forEach((param) => {
        myowner = param.name + "," + myowner;
      });
      return myowner;
    },
  },
};
</script>