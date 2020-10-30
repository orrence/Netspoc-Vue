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
        this.getAdminsForAllOwner();
      },
    },
    selection: {
      handler() {
        console.log('LOAD ADMINS DATA NOW');
        this.admins = {};
        this.getAdminsForAllOwner();
      },
    },
    /*requests(amount) {
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
    ...mapActions("services", ["getAdminsData"]),
    getAdminsForAllOwner() {
      console.log('LOAD ADMINS');
      console.log(this.selection);
      if (this.selection.length > 0) {
        var owner = this.selection[0].owner.map((owner) => owner.name);
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

    console.log('LADAAAAD ADMINS');
      const payload = {
        chosen_networks: "",
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
