<template>
<v-container fluid>
	<v-row v-if="selectable" dense :justify="'space-between'" :align="'center'">
		<v-col cols="auto">
			<h5> {{selectedRows}} Netze ausgewählt </h5>
		</v-col>
		<v-col cols="auto">
			<v-btn 
			text
			color="blue lighten-2" 
			@click="selectAll"
			>
				alle auswählen
			</v-btn>
			<v-btn
			text
			color="orange lighten-2"
			@click="deselectAll"
			>
				alle abwählen
			</v-btn>
		</v-col>
	</v-row>
	<v-row>
		<v-col>
			<div v-observe-visibility="visibilityChanged" ref="table"/>
		</v-col>
	</v-row>
</v-container>
</template>

<script>
import Tabulator from 'tabulator-tables';

export default {
	props: ['groupBy', 'selectable', 'columns', 'data', 'height'],
	data: () => ({
		isVisible: false,
		newData: false,
		newConfig: false,
		tabulator: null, //variable to hold your table
		selected: [],
		selectedRows: 0,
		config: {
			columns: [],
			data: [],
			selectable: false,
			groupBy: "",
			layout: "fitColumns",
			layoutColumnsOnNewData: true,
			placeholder: "No Data Available",
		}
	}),
	watch: {
		//update table if data changes
		"data": {
			handler: function () {
				if(this.isVisible) {
					this.config.data = this.data;
					this.tabulator.replaceData(this.config.data);
					this.newData = false;
				} else {
					this.newData = true;
				}
			}
		},
		"groupBy": {
			handler: function () {
				if(this.isVisible) {
					this.config.groupBy = this.groupBy;
					this.tabulator.setGroupBy(this.config.groupBy);
					this.newConfig = false;
				} else {
					this.newConfig = true;
				}
			}
		},
		"selectable": {
			handler: function () {
				if(this.isVisible) {
					this.config.selectable = this.selectable;
					this.newTable();
					this.newConfig = false;
					this.newData = false;
				} else {
					this.newConfig = true;
				}
			}
		}
	},
	mounted () {
		if (this.height) {
			this.$refs.table.setAttribute("style", "height:" + this.height + ";");
		} else {
			this.$nextTick(function() {
				window.addEventListener('resize', this.resize);
				this.resize();
			});
		}
		this.config.columns = this.columns;
		this.config.data = this.data;
		this.config.groupBy = this.groupBy;
		this.config.selectable = this.selectable;
		var vm = this; // important
		this.config.rowSelectionChanged = function(data){
			vm.selectedRows = data.length;
			vm.selected = data;
			vm.emitSelectionUpdate();
		}
		this.newTable();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);
	},
	methods: {
		newTable () {
			this.tabulator = new Tabulator(this.$refs.table, this.config);
		},
		selectAll () {
			this.tabulator.selectRow();
		},
		deselectAll () {
			this.tabulator.deselectRow();
		},
		emitSelectionUpdate () {
			this.$emit('selectionUpdate', this.selected);
		},
		visibilityChanged (isVisible) {
			this.isVisible = isVisible;
			if (!this.height) { this.resize(); }
			if (isVisible){
				if (this.newConfig) {
					this.config.selectable = this.selectable;
					this.config.groupBy = this.groupBy;
					this.newTable();
					this.newConfig = false;
					this.newData = false;
				} else if (this.newData) {
					this.config.data = this.data;
					this.tabulator.replaceData(this.config.data);
					this.newData = false;
				}
			}
		},
		resize() {
			this.$refs.table.setAttribute("style", "min-height:200px; height:" + (window.innerHeight - this.$refs.table.getBoundingClientRect().top - 50) + "px;");
			// this.tabulator.redraw();
		}
	}
}
</script>
