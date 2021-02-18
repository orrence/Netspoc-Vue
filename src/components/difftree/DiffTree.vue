<template>
  <div>
    <div v-if="loaded">
      <!-- <v-checkbox 
	v-model="collapse"
	label="Nodes Zusammenfassen" 
	/>
		<v-treeview
		:items="collapsedTree"
		open-all
		dense
		open-on-click
		/> -->

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
      <!-- {{ collapsedTree }} -->
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
    tree: [],
    collapsedTree: [],
    loaded: false,
    ic: 1,
  }),
  computed: {
    ...mapState(["active"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  mounted() {
    this.getDiff();
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.getDiff();
      },
    },
    oldPolicy() {
      this.getDiff();
    },
  },
  methods: {  
    getDiff() {
      var vm = this; // get vue instance
      vm.loaded = false;
      if (!vm.getActiveOwner) {
        return;
      }
      vm.axios
        .get("/get_diff", {
          params: {
            active_owner: vm.getActiveOwner,
            history: vm.getActivePolicy,
            version: vm.oldPolicy,
          },
        })
        .then(function (response) {
          vm.ic = 0;
          vm.tree = Object.values(response.data);
    
          vm.loaded = true;
        })
        .catch(function (error) {
          vm.tree = [];
          vm.collapsedTree = [];
          alert("get_diff: " + error);
        });
    },
  },
};
</script>
<style scoped>
.loadingoverlay {
	top: 0
}
</style>