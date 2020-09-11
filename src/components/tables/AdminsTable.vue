<template>
  <Tabulator
    :name="`Verantwortliche`"
    :columns="[
	{
		title: 'Verantwortung',
		field: 'email',
	}
]"
    reactiveData="true"
    :data="adminsData"
    :selectable="false"
    :groupBy="'owner'"
    :height="'140px'"
  />
</template>

<script>
import Tabulator from "./Tabulator";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Tabulator,
  },
  props: ["selection"],
  data: () => ({
    data: [],
    buffer: [],
    requests: 0,
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("services", ["adminsData"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
        console.log("ACTIVE LOAD");
        this.getAdminsForAllOwner();
      },
    },
    /*selection: {
      handler() {
        this.admins = {};
        this.getAdminsForAllOwner();
      },
    },
    requests(amount) {
      if (amount === 0) {
        this.data = this.buffer;
        this.buffer = [];
      }
    }, */
  },
  mounted() {
    this.getAdminsForAllOwner();
  },
  methods: {
    ...mapActions("services", ["getAdmins"]),
    getAdminsForAllOwner() {
      if (this.selection) {
        var owner = this.selection.owner.map((owner) => owner.name);
        this.requests = owner.length;
        for (let i = 0; i < owner.length; i++) {
          this.getAdmins(owner[i]);
        }
      }
    },
    getAdmins(owner) {
      var vm = this;
      if (!vm.getActiveOwner || !vm.getActivePolicy) {
        this.requests--;
        return;
      }

      const payload = {
        chosen_networks: "",
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        owner: owner,
      };
      this.getAdmins(payload);

      /*.then(function (response) {
          var admins = response.data.records;
          for (let i = 0; i < admins.length; i++) {
            vm.buffer.push({
              owner: owner,
              email: admins[i].email,
            });
          }
          vm.requests--;
        })
        .catch(function (error) {
          vm.requests--;
          alert(`get_admins(${owner}): ` + error);
        }); */
    },
  },
};
</script>
