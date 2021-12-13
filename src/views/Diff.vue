<template>
  <v-container fluid>
    <h3>Vergleiche den ausgewählten Stand mit einem älteren</h3>
    <v-row dense :align="'center'">
      <v-col cols="4">
        <v-card tile>
          <v-card-text>
            {{ availablePolicies }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-combobox
          v-if="olderPolicies.length > 0"
          id="combo_compare_policies"
          label="Vergleichsstand"
          :items="olderPolicies"
          v-model="oldPolicy"
          :item-text="genDateTimeString"
          return-object
          outlined
          dense
          color="orange"
          class="pt-2"
        />
      </v-col>
      <v-col cols="4">
        <v-checkbox
          @click="toggleDiffViaMail"
          color="info"
          label="Diff per Mail senden"
          v-model="diffViaMail"
        ></v-checkbox>
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
import Vue from "vue";

export default {
  components: {
    diffTree,
  },
  data: () => ({
    olderPolicies: [],
    oldPolicy: null,
    difftreeheight: 200,
    diffViaMail: false,
  }),
  created() {
    this.getDiffViaMailState();
  },
  mounted() {
    this.getOlderPolicies();
  },
  computed: {
    ...mapState(["active"]),
    ...mapGetters(["getHistory", "getActivePolicy", "getActiveOwner"]),
    availablePolicies() {
      if (this.olderPolicies && this.olderPolicies.length === 0)
        return "Keine älteren Stände verfügbar.";
      else if (this.olderPolicies && this.olderPolicies.length === 1)
        return "1 älterer Stand verfügbar.";
      else return this.olderPolicies.length + " ältere Stände verfügbar.";
    },
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.getOlderPolicies();
        this.oldPolicy = null;
        this.getDiffViaMailState();
      },
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
    genDateTimeString(val) {
      return val.date + " " + val.time;
    },
    getDiffViaMailState() {
      const formData = new FormData();
      formData.append("active_owner", this.getActiveOwner);

      Vue.axios
        .post("get_diff_mail", formData)
        .then((res) => {
          let r = res.data.records[0];
          if (r) {
            this.diffViaMail = r.send;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleDiffViaMail() {
      const formData = new FormData();
      formData.append("active_owner", this.getActiveOwner);
      formData.append("send", this.diffViaMail);

      return Vue.axios
        .post("set_diff_mail", formData)
        .then((res) => {
          if (res.data.success) {
            // the next line isn't necessary, it happens automatically through the v-bind in the template
            //this.diffViaMail = !this.diffViaMail;
          } else {
            console.log("ERROR ON SET DIFF PER MAIL!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
