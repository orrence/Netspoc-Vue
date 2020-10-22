<template>
<v-container fluid>
	<v-row dense :justify="'space-between'" :align="'center'">
		<v-col cols="auto">
			<v-btn 
			icon
			color="red lighten-2" 
			@click="downloadAsPDF"
			>
				<span class="material-icons">picture_as_pdf</span>
			</v-btn>

			<v-btn 
			icon
			color="green lighten-2" 
			@click="downloadAsExcel"
			>
				<span class="material-icons">border_all</span>
			</v-btn>
		</v-col>

		<v-col v-if="selectable" cols="auto">
			<div v-if="selectedRows > 1">{{ selectedRows }} {{ name }} ausgewählt</div>
			<div v-else>{{ data.length }} {{ name }} verfügbar</div>
		</v-col>
		
		<v-col v-if="selectable" cols="auto">
			<v-btn 
			icon
			color="blue lighten-2" 
			@click="selectAll"
			>
				<span class="material-icons">add_circle_outline</span>
			</v-btn>

			<v-btn
			icon
			color="orange lighten-2"
			@click="deselectAll"
			>
				<span class="material-icons">remove_circle_outline</span>
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
import { mapGetters } from 'vuex';
import Tabulator from 'tabulator-tables';

export default {
	props: ['tableconfig','groupBy', 'selectable', 'columns', 'data', 'height', 'name', 'maxSelections'],
	data: () => ({
		isVisible: false,
		newData: false,
		newConfig: false,
		tabulator: null, //variable to hold your table
		selected: [],
		selectedRows: 0,
		lastClick: 0,
		config: {
			columns: [],
			data: [],
			groupBy: "",
			layout: "fitColumns",
			layoutColumnsOnNewData: true,
			placeholder: "No Data Available",
		}
	}),
	computed: mapGetters(['getActiveOwner', 'getActivePolicy']),
	watch: {
		//update table if data changes
		"data": {
			handler: function () {
				if(this.isVisible) {
					this.config.data = this.data;
					this.tabulator.replaceData(this.config.data);
					console.log('SELECT ORW');
					console.log(this.config.data);
					this.tabulator.selectRow("10.61.191.11");
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
	},
	mounted () {
		/* if (this.height) {
			this.$refs.table.setAttribute("style", "height:" + this.height + ";");
		} else {
			this.$nextTick(function() {
				window.addEventListener('resize', this.resize);
				this.resize();
			});
		} */
		this.config.columns = this.columns;
		this.config.data = this.data;
		this.config.groupBy = this.groupBy;

		this.config = Object.assign({},this.config, this.tableconfig);
		var vm = this; // important
		
		this.config.rowClick = function(e, row){
			if (!vm.selectable) return;

			var ctrl = e.ctrlKey;
			var shift = e.shiftKey;
			
			if (ctrl && shift){
				let a,b;
				if (vm.lastClick > row.getIndex()) {
					a = row.getIndex();
					b = vm.lastClick;
				} else {
					a = vm.lastClick;
					b = row.getIndex();
				}
				for (a; a <= b; a++) { 
					if (vm.tabulator.getRow(a).isSelected())
						vm.tabulator.deselectRow(a);
					else
						vm.tabulator.selectRow(a);
				}
			}
			else if (ctrl) {
				row.isSelected() ? row.deselect() : row.select();
			} 
			else if (shift) {
				vm.deselectAll();
				var a,b;
				if (vm.lastClick > row.getIndex()) {
					a = row.getIndex();
					b = vm.lastClick
				} else {
					a = vm.lastClick;
					b = row.getIndex();
				}
				for (a; a <= b; a++){
					vm.tabulator.selectRow(a);
				}
			} 
			else {
				vm.deselectAll();
				row.toggleSelect();
			}
			vm.lastClick = row.getIndex();
		};
		
		this.config.rowSelectionChanged = function(data){
			vm.selectedRows = data.length;
			vm.selected = data;
			vm.emitSelectionUpdate();
		};
		
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
		downloadAsPDF () {
			this.tabulator.download("pdf", `${this.name}.pdf`, {
        orientation:"portrait", //set page orientation to portrait
        title: this.name, //add title to report
    });
		},
		downloadAsExcel () {
			this.tabulator.download("xlsx", `${this.name}_${this.getActiveOwner}_${this.getActivePolicy}.xlsx`, {sheetName: this.name});
		},
		resize () {
			this.$refs.table.setAttribute("style", "min-height:200px; height:" + (window.innerHeight - this.$refs.table.getBoundingClientRect().top - 50) + "px;");
			// this.tabulator.redraw();
		}
	}
}

</script>