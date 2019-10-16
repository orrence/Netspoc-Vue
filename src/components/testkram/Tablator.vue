<template>
<v-container>
	<v-btn color="success" @click="selectFirst">1. Element auswaehlen</v-btn>
	<v-btn color="success" @click="deselectFirst">1. Element abwaehlen</v-btn>
	<v-btn color="success" @click="selectAll">alle Elemente auswaehlen</v-btn>
	<v-btn color="success" @click="deselectAll">alle Elemente abwaehlen</v-btn>
	<br>
	Selected: {{selectedRows}}

	<div id="test-table"></div>
</v-container>
</template>

<script>
import Tabulator from 'tabulator-tables';

export default {
	data: () => ({
		table: null,
		data: [
			{id:1, name:"Oli Bob", 						progress: 12, 	gender: "male", 	rating: 1, col: "red", 		dob: "14/04/1984", car: 1,		},
			{id:2, name:"Mary May", 					progress: 1,		gender: "female", rating: 2, col: "blue", 	dob: "14/05/1982", car: true,	},
			{id:3, name:"Christine Lobowski", progress: 42,		gender: "female", rating: 0, col: "green", 	dob: "22/05/1982", car: true,	},
			{id:4, name:"Brendon Philips", 		progress: 100, 	gender: "male", 	rating: 1, col: "orange", dob: "01/08/1980", car: '',		},
			{id:5, name:"Margret Marmajuke", 	progress: 16, 	gender: "female", rating: 5, col: "yellow", dob: "31/01/1999", car: '',		},
			{id:6, name:"Frank Harbours", 		progress: 38, 	gender: "male", 	rating: 4, col: "red", 		dob: "12/05/1966", car: 1,		},
			{id:7, name:"Jamie Newhart", 			progress: 23, 	gender: "male", 	rating: 3, col: "green", 	dob: "14/05/1985", car: true,	},
			{id:8, name:"Gemma Jane", 				progress: 60, 	gender: "female", rating: 0, col: "red", 		dob: "22/05/1982", car: true,	},
			{id:9, name:"Emily Sykes", 				progress: 42, 	gender: "female", rating: 1, col: "maroon", dob: "11/11/1970", car: '',		},
			{id:10,name:"James Newman", 			progress: 73, 	gender: "male", 	rating: 5, col: "red", 		dob: "22/03/1998", car: '',		},
		],
		selectedRows: 0
	}),
	mounted () {
		var vm = this;
		vm.table = new Tabulator("#test-table", {
			height: "311px",
			selectable: true,
			data: vm.data,
			columns: [
				{title:"Name", field:"name", width:200, formatter: "textarea"},
				{title:"Progress", field:"progress", width:100, align:"right", sorter:"number"},
				{title:"Gender", field:"gender", width:100},
				{title:"Rating", field:"rating", align:"center", width:80},
				{title:"Favourite Color", field:"col"},
				{title:"Date Of Birth", field:"dob", align:"center", sorter:"date"},
				{title:"Driver", field:"car", align:"center", width:100},
			],
			rowSelectionChanged: function(data){
				vm.selectedRows = data.length;
			}
		});
	},
	methods: {
		selectFirst () {
			this.table.selectRow(1);
		},
		deselectFirst () {
			this.table.deselectRow(1);
		},
		selectAll () {
			this.table.selectRow();
		},
		deselectAll () {
			this.table.deselectRow();
		}
	}
}
</script>