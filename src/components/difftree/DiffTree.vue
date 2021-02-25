<template>
  <div>
    <div v-if="loaded">
      <v-treeview :items="tree" open-all dense item-text="text" open-on-click>
        <template v-slot:prepend="{ item, open }">
          <span
            style="color: green"
            v-if="item.iconCls && item.iconCls == 'icon-add'"
            class="material-icons"
            >add_circle_outline</span
          >
          <span
            style="color: red"
            v-else-if="item.iconCls && item.iconCls == 'icon-delete'"
            class="material-icons"
            >remove_circle_outline</span
          >
          <v-icon v-else-if="item.leaf"> mdi-file-document-outline </v-icon>
          <v-icon v-else>
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
        </template>
      </v-treeview>
    </div>
    <div :class="loaded ? 'hidden' : ''" class="loadingoverlay">
      <div class="loadingcircle">
        <v-progress-circular
          color="deep-orange"
          indeterminate
          size="94"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "diff-tree",
  props: {
    oldPolicy: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    collapse: true,
    loaded: false,
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("diff", ["tree"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  mounted() {
    this.getDiff();
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.$store.commit("diff/SET_TREE", []);
      },
    },
    oldPolicy() {
      this.getDiff();
    },
  },
  methods: {
    getDiff() {
      var vm = this;
      vm.loaded = false;
      let params = {
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        version: vm.oldPolicy,
      };
      this.$store.dispatch("diff/requestDiff", params).then(function () {
        vm.loaded = true;
      });
    },
  },
};
</script>
<style scoped>
.loadingoverlay {
  top: 0;
}
</style>