<template>
<v-container fluid>
	<v-row dense :justify="'center'">
		<v-col cols="3">
			<OwnerAdminTable/>
		</v-col>
		<v-col cols="3">
			<OwnerWatcherTable/>
		</v-col>
		<v-col cols="3">
		</v-col>
		<v-col cols="3">
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import OwnerAdminTable   from '../components/tables/Responsibility/OwnerAdminTable';
import OwnerWatcherTable from '../components/tables/Responsibility/OwnerWatcherTable';

export default {
	components: {
		OwnerAdminTable,
		OwnerWatcherTable
	},
	data: () => ({
		superiorOwner : ''
	}),
	methods: {
		
	}
}
</script>
