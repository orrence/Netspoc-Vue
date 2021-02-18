<template>
  <v-container v-if="getActiveLoaded" fluid>
    <h3>Vergleiche den ausgewählten Stand mit einem älteren</h3>
    <v-row dense :align="'center'">
      <v-col cols="6">
        <v-card tile>
          <v-card-text>
            {{ availablePolicies }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-combobox
          v-if="olderPolicies.length > 0"
          id="combo_compare_policies"
          label="Vergleichsstand"
          :items="olderPolicies"
          v-model="oldPolicy"
          item-text="date"
          return-object
          outlined
          dense
          color="orange"
          class="pt-2"
        />
      </v-col>
    </v-row>
    <v-row dense ref="diffree">
      <v-col>
        <v-card
          class="overflow-auto"
           v-resize="calcHeight"
          :style="{ height: difftreeheight + 'px' }"
          tile
        >
          <diff-tree
            v-if="!isEmpty(oldPolicy)"
            :oldPolicy="oldPolicy.date"
          ></diff-tree>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import diffTree from "../components/difftree/DiffTree";

export default {
  components: {
    diffTree,
  },
  data: () => ({
    olderPolicies: [],
    oldPolicy: null,
    difftreeheight: 200,
  }),
  mounted() {
    if (this.getActiveLoaded) {
      this.getOlderPolicies();
    }
  },
  computed: {
    ...mapState(["active"]),
    ...mapGetters(["getHistory", "getActivePolicy", "getActiveLoaded"]),
    availablePolicies() {
      if (this.olderPolicies && this.olderPolicies.length === 0)
        return "Keine älteren Stände verfügbar.";
      else if (this.olderPolicies && this.olderPolicies.length === 1)
        return "1 älterer Stand verfügbar.";
      else return this.olderPolicies.length + "ältere Stände verfügbar.";
    },
  },
  watch: {
    getActivePolicy(val, oldVal) {
      if (val !== oldVal) {
        this.getOlderPolicies();

        if (this.olderPolicies.length > 0) {
          this.oldPolicy = this.olderPolicies[0];
        } else {
          this.oldPolicy = null;
        }
      }
    },
  },

  methods: {
    isEmpty(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
      }
      return true;
    },
    calcHeight() {
      let restheight =
        window.innerHeight - this.$refs.diffree.getBoundingClientRect().top;
      this.difftreeheight = restheight - 10;
    },
    getOlderPolicies() {
      var history = this.getHistory;
      var active = this.active.policy.date;
      var newOld = [];
      for (let i = 0; i < history.length; i++) {
        if (active > history[i].date) {
          newOld.push(history[i]);
        }
      }
      this.olderPolicies = newOld;
    },
  },
};
</script>
