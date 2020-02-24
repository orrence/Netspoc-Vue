<template>
<v-container>
	<v-row class="row">

		<v-col class="item">
			<h2>Netzauswahl</h2>
			<div class="tablediv">
				<NetworkTable @clicked="onRowClick"/>
			</div>
		</v-col>

		<v-col class="item">
			<h2>Enthaltene Ressourcen</h2>
			<div class="tablediv">
				<ResourceTable :selection="selected"/>
			</div>
		</v-col>

	</v-row>
</v-container>
</template>

<script>
import NetworkTable from './tables/NetworkTable';
import ResourceTable from './tables/NetworkResourceTable';

export default {
	components: {
		NetworkTable,
		ResourceTable
	},
	data: () => ({
		selected: null,
	}),
	methods: {
		onRowClick(rowData) {
			this.selected = rowData;
		}
	}
}
</script>

<style>
.row {
	height: 100%;
}
.container {
	height: 100%;
}
.item {
	height: 100%;
}
.tablediv {
	/*wenn die Höhe zu groß für den umgebenden Container ist,
		wird die Tabelle nicht gerendert! - Warum? Default - lösung?*/
	/*besser schrifthöhe nehmen als pixel*/
	height: calc(100% - 6ex);
}
</style>
