<template>
  <div id="table_admins" ref="adminstable">
    <Tabulator
      :name="`Verantwortliche`"
      :columns="[
        {
          title: 'Verantwortung',
          field: 'email',
        },
      ]"
      reactiveData="true"
      :variableHeight="tabheight"
      :data="adminsData"
      :showCountHeader="false"
    />
  </div>
</template>

<script>
import Tabulator from "./Tabulator";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Tabulator,
  },
  props: ["selection", "activetab"],
  data: () => ({
    data: [],
    buffer: [],
    tabheight: 100,
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("services", ["adminsData", "searchInput"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    selection: {
      handler() {
        this.admins = {};
        this.getAdminsForAllOwner();
      },
    },
  },
  mounted() {
    this.calcHeight();
    this.getAdminsForAllOwner();
  },
  methods: {
    ...mapActions("services", ["getAdminsData"]),
    calcHeight() {
    
      let menuheight = document.getElementById('apptoolbar').clientHeight;
      let restheight =
        window.innerHeight - this.$refs.adminstable.getBoundingClientRect().top-menuheight;
      this.tabheight = restheight -3;
    },
    getAdminsForAllOwner() {
      if (this.selection.length > 0) {
        var owner = this.selection[0].owner.map((owner) => owner.name);
        this.getAdmins(owner[0]);
      }
    },
    getAdmins(owner) {
      this.$store.dispatch("services/getAdminsData", owner);
    },
  },
};
</script>
