<template>
  <div id="table_admins">
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
  props: ["selection"],
  data: () => ({
    data: [],
    buffer: [],
  }),
  computed: {
    ...mapState(["active"]),
    ...mapState("services", ["adminsData","searchInput"]),
    ...mapGetters(["getActiveOwner", "getActivePolicy"]),
  },
  watch: {
    active: {
      deep: true,
      handler() {
        this.getAdminsForAllOwner();
      },
    },
    selection: {
      handler() {
        this.admins = {};
        this.getAdminsForAllOwner();
      },
    },
    
  },
  mounted() {
    this.getAdminsForAllOwner();
  },
  methods: {
    ...mapActions("services", ["getAdminsData"]),
    getAdminsForAllOwner() {
  
      if (this.selection.length > 0) {
        var owner = this.selection[0].owner.map((owner) => owner.name);
         this.getAdmins(owner[0]);
      }
    },
    getAdmins(owner) {
      var vm = this;
  
      const payload = {
        chosen_networks: vm.searchInput.search_networks.join(","),
        active_owner: vm.getActiveOwner,
        history: vm.getActivePolicy,
        owner: owner,
      };
      this.$store.dispatch('services/getAdminsData',payload);
      //this.getAdminsData(payload);

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
